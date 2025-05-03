import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { PdfViewer } from './components/PdfViewer'
import { Sidebar } from './components/Sidebar'
import { getDocument } from 'pdfjs-dist'

type FolderLoadResult = {
  folderPath: string
  pdfs: string[]
  folders: string[]
}

export const App = () => {
  const [pdfs, setPdfs] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [subfolders, setSubfolders] = useState<string[]>([])
  const [folderPath, setFolderPath] = useState<string | null>(null)

  const [newName, setNewName] = useState('')
  const [targetFolder, setTargetFolder] = useState('')

  const [pdfPage, setPdfPage] = useState(1)
  const [pageCount, setPageCount] = useState<number | null>(null)

  useEffect(() => {
    const setFileName = async () => {
      if (pdfs.length > 0 && pdfs[current]) {
        const name = await window.electronAPI.getFilename(pdfs[current])
        setNewName(name)
      }
    }

    setFileName().then()
  }, [current, pdfs])

  useEffect(() => {
    const fetchPageCount = async () => {
      if (pdfs.length > 0 && pdfs[current]) {
        const buffer = await window.electronAPI.loadPdfBuffer(pdfs[current])
        if (!buffer) return
        const pdf = await getDocument({ data: buffer }).promise
        setPageCount(pdf.numPages)
        setPdfPage(1) // reset page on file change
      }
    }

    fetchPageCount().catch(console.error)
  }, [pdfs, current])

  const handleSelectFolder = async () => {
    const result: FolderLoadResult | null = await window.electronAPI.selectFolder()
    if (!result) return

    setFolderPath(result.folderPath)
    setPdfs(result.pdfs)
    setSubfolders(result.folders)
    setTargetFolder(result.folders[0] || '')
    setCurrent(0)
    setNewName('') // Reset on folder change
  }

  const loadLastFolder = async () => {
    const result: FolderLoadResult | null = await window.electronAPI.getLastFolder()
    if (!result) return

    setFolderPath(result.folderPath)
    setPdfs(result.pdfs)
    setSubfolders(result.folders)
    setTargetFolder(result.folders[0] || '')
    setCurrent(0)
    setNewName('')
  }

  useEffect(() => {
    loadLastFolder()
  }, [])

  const handleSubmit = async () => {
    if (!folderPath || !pdfs[current]) return

    const originalPath = pdfs[current]

    const result = await window.electronAPI.moveAndRename(
      originalPath,
      folderPath,
      targetFolder,
      newName
    )

    if (result.success) {
      // Move to next file
      const updated = [...pdfs]
      updated.splice(current, 1) // remove current file
      setPdfs(updated)
      setCurrent((prev) => Math.max(0, prev - 1))
      setNewName('')
    } else {
      alert(`Failed to move: ${result.error}`)
    }
  }

  const handleDelete = async () => {
    if (!pdfs[current]) return

    const confirmed = window.confirm('Are you sure you want to delete this file?')
    if (!confirmed) return

    const result = await window.electronAPI.deleteFile(pdfs[current])
    if (result.success) {
      const updated = [...pdfs]
      updated.splice(current, 1) // remove current file
      setPdfs(updated)
      setCurrent((prev) => Math.max(0, prev - 1))
      setNewName('')
    } else {
      alert(`Failed to delete: ${result.error}`)
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Top Bar */}
      <Box p={2} borderBottom={1} borderColor="divider" display="flex" alignItems="center">
        <Button variant="contained" onClick={handleSelectFolder}>
          Select Folder
        </Button>
        {folderPath && (
          <Typography variant="body2" ml={2} color="textSecondary">
            Current Folder: {folderPath}
          </Typography>
        )}
      </Box>

      {/* Main Layout */}
      <Box display="flex" flex="1" overflow="hidden">
        {/* Sidebar */}
        <Sidebar
          pdfs={pdfs}
          current={current}
          subfolders={subfolders}
          newName={newName}
          targetFolder={targetFolder}
          pageCount={pageCount}
          pdfPage={pdfPage}
          onPreviousFile={() => setCurrent((c) => Math.max(0, c - 1))}
          onNextFile={() => setCurrent((c) => Math.min(pdfs.length - 1, c + 1))}
          onNameChange={setNewName}
          onFolderChange={setTargetFolder}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onPreviousPage={() => setPdfPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setPdfPage((p) => Math.min(pageCount || 1, p + 1))}
        />

        {/* PDF Viewer Panel */}
        <Box flex={1} overflow="auto" p={2}>
          {pdfs.length > 0 ? (
            <PdfViewer filePath={pdfs[current]} pageNumber={pdfPage} />
          ) : (
            <Typography variant="body1">No PDF selected.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}
