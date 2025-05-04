import fs from 'fs'
import { fileURLToPath } from 'url'

export async function handleLoadPdfBuffer(_: unknown, filePath: string) {
  try {
    if (filePath.startsWith('file://')) {
      filePath = fileURLToPath(filePath)
    }

    const buffer = fs.readFileSync(filePath)
    return buffer
  } catch (err) {
    console.error('Failed to read PDF file:', filePath, err)
    return null
  }
}
