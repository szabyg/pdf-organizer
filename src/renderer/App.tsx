import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography, Paper, Divider } from '@mui/material'
import { PdfViewer } from './components/PdfViewer'

export const App = () => {
  const [pdfs, setPdfs] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [newName, setNewName] = useState('')
  const [targetFolder, setTargetFolder] = useState('')

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

  const handleSubmit = () => {
    console.log('Rename to:', newName)
    console.log('Move to folder:', targetFolder)
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Top bar */}
      <Box p={2} borderBottom={1} borderColor="divider">
        <Button variant="contained" onClick={handleSelectFolder}>
          Select Folder
        </Button>
      </Box>

      {/* Main layout */}
      <Box display="flex" flex="1" overflow="hidden">
        {/* Left form panel */}
        <Box
          component={Paper}
          elevation={2}
          width={320}
          p={2}
          display="flex"
          flexDirection="column"
          gap={2}
          borderRight={1}
          borderColor="divider"
          overflow="auto"
        >
          {pdfs.length > 0 && (
            <>
              <Typography variant="subtitle1">
                File {current + 1} of {pdfs.length}
              </Typography>

              <TextField
                label="New File Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                fullWidth
              />

              <TextField
                label="Target Folder"
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                fullWidth
              />

              <Divider />

              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Rename and Move
              </Button>
            </>
          )}
        </Box>

        {/* Right viewer panel */}
        <Box flex={1} overflow="auto" p={2}>
          {pdfs.length > 0 && <PdfViewer filePath={pdfs[current]} />}
        </Box>
      </Box>
    </Box>
  )
}
