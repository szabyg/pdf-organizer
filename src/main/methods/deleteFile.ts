import fs from 'fs'

export async function handleDeleteFile(_: unknown, filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return { success: true }
    }
    return { success: false, error: 'File does not exist' }
  } catch (err: any) {
    console.error('Failed to delete file:', err)
    return { success: false, error: err.message }
  }
}
