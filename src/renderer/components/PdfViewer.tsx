import React, { useEffect, useRef } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'

// ✅ Use the CDN version directly
GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'

export interface PdfViewerProps {
  filePath: string
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ filePath }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const renderPDF = async () => {
      const buffer = await window.electronAPI.loadPdfBuffer(filePath)
      if (!buffer) {
        console.error('Failed to load buffer for:', filePath)
        return
      }

      const loadingTask = getDocument({ data: buffer })
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')!
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport,
      }

      await page.render(renderContext).promise
    }

    renderPDF().catch(console.error)
  }, [filePath])

  return <canvas ref={canvasRef} />
}
