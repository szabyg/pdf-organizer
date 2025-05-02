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

  const handleSubmit = () => {
    const originalPath = pdfs[current]
    const newPath = `${folderPath}\\${targetFolder}\\${newName}.pdf`
    console.log('Should move:', originalPath)
    console.log('To:', newPath)
    // ⏳ Replace with actual IPC call to move the file in main.ts
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
              <Typography variant="subtitle1">
                File {current + 1} of {pdfs.length}
              </Typography>

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
