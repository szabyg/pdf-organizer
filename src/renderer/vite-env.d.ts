/// <reference types="vite/client" />

declare module '*?worker' {
  const worker: {
    new (): Worker
  }
  export default worker
}

interface Window {
  electronAPI: {
    selectFolder: () => Promise<{ folderPath: string; pdfs: string[]; folders: string[] } | null>
    getLastFolder: () => Promise<{ folderPath: string; pdfs: string[]; folders: string[] } | null>
    loadPdfBuffer: (filePath: string) => Promise<Uint8Array | null>
    getFilename: (filePath: string) => Promise<string>
    moveAndRename: (
      oldPath: string,
      folderPath: string,
      subfolder: string,
      newName: string
    ) => Promise<{ success: boolean; newPath?: string; error?: string }>
    deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>
  }
}
