import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  loadPdfBuffer: (filePath: string) => ipcRenderer.invoke('load-pdf-buffer', filePath),
})
