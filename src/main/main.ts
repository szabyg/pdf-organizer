import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Store from 'electron-store'
import ElectronStore from 'electron-store'

const isDev = process.env.NODE_ENV === 'development'

type StoreSchema = {
  lastFolder: string
}

const store: ElectronStore<StoreSchema> = new Store<StoreSchema>()

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (result.canceled || result.filePaths.length === 0) return null

  const selectedPath = result.filePaths[0]
  store.set('lastFolder', selectedPath)

  const entries = fs.readdirSync(selectedPath, { withFileTypes: true })

  const pdfs = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
    .map((e) => path.join(selectedPath, e.name))

  const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name)

  return {
    folderPath: selectedPath,
    pdfs,
    folders,
  }
})

ipcMain.handle('get-last-folder', async () => {
  const lastPath = store.get('lastFolder')
  if (!lastPath || !fs.existsSync(lastPath)) return null

  const entries = fs.readdirSync(lastPath, { withFileTypes: true })

  const pdfs = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
    .map((e) => path.join(lastPath, e.name))

  const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name)

  return {
    folderPath: lastPath,
    pdfs,
    folders,
  }
})

ipcMain.handle('load-pdf-buffer', async (_, filePath: string) => {
  try {
    // Remove 'file://' prefix if present
    if (filePath.startsWith('file://')) {
      filePath = fileURLToPath(filePath)
    }

    const buffer = fs.readFileSync(filePath)
    return buffer
  } catch (err) {
    console.error('Failed to read PDF file:', filePath, err)
    return null
  }
})

ipcMain.handle('get-filename', (_, filePath: string) => {
  return path.basename(filePath, '.pdf')
})

ipcMain.handle(
  'move-and-rename',
  async (_, oldPath: string, folderPath: string, subfolder: string, newName: string) => {
    try {
      const newPath = path.join(folderPath, subfolder, `${newName}.pdf`)

      // Ensure target directory exists (should already, but safe)
      const targetDir = path.dirname(newPath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      fs.renameSync(oldPath, newPath)
      return { success: true, newPath }
    } catch (err: any) {
      console.error('Failed to move file:', err)
      return { success: false, error: err.message }
    }
  }
)
