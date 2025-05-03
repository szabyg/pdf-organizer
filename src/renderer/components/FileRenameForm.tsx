import React from 'react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !disableSubmit) {
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
      />

      <FormControl fullWidth>
        <InputLabel id="target-folder-label">Target Folder</InputLabel>
        <Select
          labelId="target-folder-label"
          value={targetFolder}
          onChange={(e) => onFolderChange(e.target.value)}
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

      <Button variant="contained" onClick={onSubmit} disabled={disableSubmit}>
        Rename & Move
      </Button>
      <Button variant="outlined" color="error" onClick={onDelete} disabled={disableDelete}>
        Delete
      </Button>
    </Box>
  )
}
