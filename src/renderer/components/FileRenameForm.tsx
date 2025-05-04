import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'

interface FileRenameFormProps {
  newName: string
  targetFolder: string
  subfolders: string[]
  onNameChange: (name: string) => void
  onFolderChange: (folder: string) => void
  onSubmit: () => void
  onDelete: () => void
  disableSubmit: boolean
  disableDelete: boolean
}

export const FileRenameForm: React.FC<FileRenameFormProps> = ({
  newName,
  targetFolder,
  subfolders,
  onNameChange,
  onFolderChange,
  onSubmit,
  onDelete,
  disableSubmit,
  disableDelete,
}) => {
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    const regex = /^\d{4}\.\d{2}(\.\d{2})? .+$/ // Matches "YYYY.MM.DD Some subject"
    setIsValid(regex.test(newName))
  }, [newName])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !disableSubmit && isValid) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} component="form" onKeyDown={handleKeyPress}>
      <TextField
        label="New File Name"
        fullWidth
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
        error={!isValid}
        helperText={!isValid ? 'Invalid format. Use "YYYY.MM.DD Some subject".' : ''}
      />

      <Typography variant="subtitle1">Select target folder</Typography>
      <List>
        {subfolders.map((folder) => (
          <ListItem key={folder} disablePadding>
            <ListItemButton
              selected={folder === targetFolder}
              onClick={() => onFolderChange(folder)}
            >
              <ListItemText primary={folder} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Button variant="contained" onClick={onSubmit} disabled={disableSubmit || !isValid}>
        Rename & Move
      </Button>
      <Button variant="outlined" color="error" onClick={onDelete} disabled={disableDelete}>
        Delete
      </Button>
    </Box>
  )
}
