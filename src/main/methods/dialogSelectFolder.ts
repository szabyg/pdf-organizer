import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import Store from 'electron-store'

type StoreSchema = {
  lastFolder: string
}

const store: Store<StoreSchema> = new Store<StoreSchema>()

export async function handleSelectFolder() {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (result.canceled || result.filePaths.length === 0) return null

  const selectedPath = result.filePaths[0]
  store.set('lastFolder', selectedPath)

  const entries = fs.readdirSync(selectedPath, { withFileTypes: true })

  const pdfs = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
    .map((e) => path.join(selectedPath, e.name))
    .sort()

  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()

  return {
    folderPath: selectedPath,
    pdfs,
    folders,
  }
}
