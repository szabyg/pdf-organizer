import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { PdfViewer } from './components/PdfViewer'
import { PdfNavigationControls } from './components/PdfNavigationControls'
import { FileRenameForm } from './components/FileRenameForm'
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
      <Box p={2} borderBottom={1} borderColor="divider">
        <Button variant="contained" onClick={handleSelectFolder}>
          Select Folder
        </Button>
      </Box>

      {/* Main Layout */}
      <Box display="flex" flex="1" overflow="hidden">
        {/* Sidebar Form */}
        <Box
          component={Paper}
          width="30%"
          p={2}
          display="flex"
          flexDirection="column"
          gap={2}
          borderRight={1}
          borderColor="divider"
        >
          {pdfs.length > 0 && (
            <>
              <PdfNavigationControls
                current={current}
                total={pdfs.length}
                onPrevious={() => setCurrent((c) => Math.max(0, c - 1))}
                onNext={() => setCurrent((c) => Math.min(pdfs.length - 1, c + 1))}
              />

              <FileRenameForm
                newName={newName}
                targetFolder={targetFolder}
                subfolders={subfolders}
                onNameChange={setNewName}
                onFolderChange={setTargetFolder}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                disableSubmit={!newName || !targetFolder}
                disableDelete={pdfs.length === 0}
              />

              {pageCount && (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    Page {pdfPage} of {pageCount}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                      disabled={pdfPage <= 1}
                    >
                      Prev Page
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setPdfPage((p) => Math.min(pageCount, p + 1))}
                      disabled={pdfPage >= pageCount}
                    >
                      Next Page
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>

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
