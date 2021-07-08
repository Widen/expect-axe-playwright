import path from 'path'
import fs from 'fs'

export async function readFile(filename: string) {
  const filePath = path.join(__dirname, '../config/templates', filename)
  return fs.promises.readFile(filePath, { encoding: 'utf-8' })
}
