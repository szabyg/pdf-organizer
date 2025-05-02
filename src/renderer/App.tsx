import React, { useEffect, useState } from 'react'
import { PdfViewer } from './components/PdfViewer'

export const App = () => {
  const [pdfs, setPdfs] = useState<string[]>([])
  const [current, setCurrent] = useState(0)

  const handleSelectFolder = async () => {
    const files = await window.electronAPI.selectFolder()
    setPdfs(files)
    setCurrent(0)
  }

  const loadLastFolder = async () => {
    const files = await window.electronAPI.getLastFolder()
    if (files.length > 0) {
      setPdfs(files)
      setCurrent(0)
    }
  }

  useEffect(() => {
    loadLastFolder()
  }, [])

  return (
    <div>
      <button onClick={handleSelectFolder}>Select Folder</button>
      {pdfs.length > 0 && (
        <>
          <p>
            Showing {current + 1} of {pdfs.length}
          </p>
          <PdfViewer filePath={pdfs[current]} />
        </>
      )}
    </div>
  )
}
