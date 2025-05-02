import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { PdfViewer } from './components/PdfViewer'

const App = () => {
  const [pdfs, setPdfs] = useState<string[]>([])
  const [current, setCurrent] = useState(0)

  const handleSelectFolder = async () => {
    const files = await window.electronAPI.selectFolder()
    setPdfs(files)
    setCurrent(0)
  }

  return (
    <div>
      <button onClick={handleSelectFolder}>Select Folder</button>
      {pdfs.length > 0 && (
        <>
          <p>
            Showing {current + 1} of {pdfs.length}
          </p>
          <PdfViewer filePath={`file://${pdfs[current]}`} />
        </>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
