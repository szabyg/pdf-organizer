import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { PdfViewer } from './components/PdfViewer'

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

  useEffect(() => {
    const setFileName = async () => {
      if (pdfs.length > 0 && pdfs[current]) {
        const name = await window.electronAPI.getFilename(pdfs[current])
        setNewName(name)
      }
    }

    setFileName().then()
  }, [current, pdfs])

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
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">
                  File {current + 1} of {pdfs.length}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setCurrent((c) => Math.min(pdfs.length - 1, c + 1))}
                    disabled={current >= pdfs.length - 1}
                  >
                    Next
                  </Button>
                </Box>
              </Box>

              <TextField
                label="New File Name"
                fullWidth
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel id="target-folder-label">Target Folder</InputLabel>
                <Select
                  labelId="target-folder-label"
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value)}
                  label="Target Folder"
                >
                  {subfolders.map((folder) => (
                    <MenuItem key={folder} value={folder}>
                      {folder}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider />

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!newName || !targetFolder}
              >
                Rename & Move
              </Button>
            </>
          )}
        </Box>

        {/* PDF Viewer Panel */}
        <Box flex={1} overflow="auto" p={2}>
          {pdfs.length > 0 ? (
            <PdfViewer filePath={pdfs[current]} />
          ) : (
            <Typography variant="body1">No PDF selected.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}
