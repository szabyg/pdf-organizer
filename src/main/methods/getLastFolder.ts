import fs from 'fs'
import path from 'path'
import Store from 'electron-store'

type StoreSchema = {
  lastFolder: string
}

const store: Store<StoreSchema> = new Store<StoreSchema>()

export async function handleGetLastFolder() {
  const lastPath = store.get('lastFolder')
  if (!lastPath || !fs.existsSync(lastPath)) return null

  const entries = fs.readdirSync(lastPath, { withFileTypes: true })

  const pdfs = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
    .map((e) => path.join(lastPath, e.name))
    .sort()

  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()

  return {
    folderPath: lastPath,
    pdfs,
    folders,
  }
}
