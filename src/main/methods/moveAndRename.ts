import fs from 'fs'
import path from 'path'

export async function handleMoveAndRename(
  _: unknown,
  oldPath: string,
  folderPath: string,
  subfolder: string,
  newName: string
) {
  try {
    const yearMatch = newName.match(/^\d{4}/)
    if (!yearMatch) {
      throw new Error('Invalid filename format. Year could not be determined.')
    }
    const year = yearMatch[0]

    const yearFolderPath = path.join(folderPath, subfolder, year)

    if (!fs.existsSync(yearFolderPath)) {
      fs.mkdirSync(yearFolderPath, { recursive: true })
    }

    const newPath = path.join(yearFolderPath, `${newName}.pdf`)

    fs.renameSync(oldPath, newPath)
    return { success: true, newPath }
  } catch (err: any) {
    console.error('Failed to move file:', err)
    return { success: false, error: err.message }
  }
}
