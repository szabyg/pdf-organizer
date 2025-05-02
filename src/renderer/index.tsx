import React from 'react'
import ReactDOM from 'react-dom/client'
import { PdfViewer } from './components/PdfViewer'

const App = () => {
  const examplePdfPath = 'https://example.com/sample.pdf'

  return (
    <div>
      <h1>PDF Preview</h1>
      <PdfViewer filePath={examplePdfPath} />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
