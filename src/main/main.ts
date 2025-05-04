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
    .sort()

  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()

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
    .sort() // Sort PDFs alphabetically

  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort() // Sort folders alphabetically

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
      // Extract the year from the filename
      const yearMatch = newName.match(/^\d{4}/)
      if (!yearMatch) {
        throw new Error('Invalid filename format. Year could not be determined.')
      }
      const year = yearMatch[0]

      // Create the year-based subfolder path
      const yearFolderPath = path.join(folderPath, subfolder, year)

      // Ensure the year-based subfolder exists
      if (!fs.existsSync(yearFolderPath)) {
        fs.mkdirSync(yearFolderPath, { recursive: true })
      }

      // Construct the new file path
      const newPath = path.join(yearFolderPath, `${newName}.pdf`)

      // Move and rename the file
      fs.renameSync(oldPath, newPath)
      return { success: true, newPath }
    } catch (err: any) {
      console.error('Failed to move file:', err)
      return { success: false, error: err.message }
    }
  }
)

ipcMain.handle('delete-file', async (_, filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return { success: true }
    }
    return { success: false, error: 'File does not exist' }
  } catch (err: any) {
    console.error('Failed to delete file:', err)
    return { success: false, error: err.message }
  }
})
