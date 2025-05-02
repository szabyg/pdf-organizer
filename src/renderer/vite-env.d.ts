/// <reference types="vite/client" />

declare module '*?worker' {
  const worker: {
    new (): Worker
  }
  export default worker
}

interface Window {
  electronAPI: {
    selectFolder: () => Promise<string[]>
    loadPdfBuffer: (filePath: string) => Promise<Uint8Array | null>
  }
}
