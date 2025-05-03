import React from 'react'
import { Box, Button, Typography } from '@mui/material'

interface PdfNavigationControlsProps {
  current: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

export const PdfNavigationControls: React.FC<PdfNavigationControlsProps> = ({
  current,
  total,
  onPrevious,
  onNext,
}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="subtitle1">
        File {current + 1} of {total}
      </Typography>
      <Box display="flex" gap={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={onPrevious}
          disabled={current === 0}
        >
          Previous
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onNext}
          disabled={current >= total - 1}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}
