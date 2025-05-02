import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const isDev = process.env.NODE_ENV === 'development'

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
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return []
  }

  const selectedPath = result.filePaths[0]
  const files = fs.readdirSync(selectedPath)
  const pdfs = files
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .map((file) => path.join(selectedPath, file))

  return pdfs
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
