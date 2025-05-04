import path from 'path'

export function handleGetFilename(_: unknown, filePath: string) {
  return path.basename(filePath, '.pdf')
}
