import React from 'react'
import { Box, Paper, Typography, Button } from '@mui/material'
import { PdfNavigationControls } from './PdfNavigationControls'
import { FileRenameForm } from './FileRenameForm'

interface SidebarProps {
  pdfs: string[]
  current: number
  subfolders: string[]
  newName: string
  targetFolder: string
  pageCount: number | null
  pdfPage: number
  onPreviousFile: () => void
  onNextFile: () => void
  onNameChange: (name: string) => void
  onFolderChange: (folder: string) => void
  onSubmit: () => void
  onDelete: () => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  pdfs,
  current,
  subfolders,
  newName,
  targetFolder,
  pageCount,
  pdfPage,
  onPreviousFile,
  onNextFile,
  onNameChange,
  onFolderChange,
  onSubmit,
  onDelete,
  onPreviousPage,
  onNextPage,
}) => {
  return (
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
            onPrevious={onPreviousFile}
            onNext={onNextFile}
          />

          <FileRenameForm
            newName={newName}
            targetFolder={targetFolder}
            subfolders={subfolders}
            onNameChange={onNameChange}
            onFolderChange={onFolderChange}
            onSubmit={onSubmit}
            onDelete={onDelete}
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
                  onClick={onPreviousPage}
                  disabled={pdfPage <= 1}
                >
                  Prev Page
                </Button>
                <Button
                  size="small"
                  onClick={onNextPage}
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
  )
}
