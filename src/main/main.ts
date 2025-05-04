import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { handleSelectFolder } from './methods/dialogSelectFolder'
import { handleGetLastFolder } from './methods/getLastFolder'
import { handleLoadPdfBuffer } from './methods/loadPdfBuffer'
import { handleGetFilename } from './methods/getFilename'
import { handleMoveAndRename } from './methods/moveAndRename'
import { handleDeleteFile } from './methods/deleteFile'

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

// Register IPC handlers
ipcMain.handle('dialog:selectFolder', handleSelectFolder)
ipcMain.handle('get-last-folder', handleGetLastFolder)
ipcMain.handle('load-pdf-buffer', handleLoadPdfBuffer)
ipcMain.handle('get-filename', handleGetFilename)
ipcMain.handle('move-and-rename', handleMoveAndRename)
ipcMain.handle('delete-file', handleDeleteFile)
