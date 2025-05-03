import { contextBridge, ipcRenderer } from 'electron'
import path from 'path'

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  getLastFolder: () => ipcRenderer.invoke('get-last-folder'),
  loadPdfBuffer: (filePath: string) => ipcRenderer.invoke('load-pdf-buffer', filePath),
  getFilename: (filePath: string) => ipcRenderer.invoke('get-filename', filePath),
  moveAndRename: (oldPath: string, folderPath: string, subfolder: string, newName: string) =>
    ipcRenderer.invoke('move-and-rename', oldPath, folderPath, subfolder, newName),
  deleteFile: (filePath: string) => ipcRenderer.invoke('delete-file', filePath),
})
