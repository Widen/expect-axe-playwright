import fs from 'node:fs/promises'

export async function readFile(filename: string) {
  const fileURL = new URL(`../config/templates/${filename}`, import.meta.url)
  return fs.readFile(fileURL, { encoding: 'utf-8' })
}
