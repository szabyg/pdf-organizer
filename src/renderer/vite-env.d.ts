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
    loadPdfBuffer: (filePath: string) => Promise<Uint8Array | null>
    getLastFolder: () => Promise<{ folderPath: string; pdfs: string[]; folders: string[] } | null>
  }
}
