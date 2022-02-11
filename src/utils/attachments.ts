import path from 'path'
import fs from 'fs/promises'
import test from '@playwright/test'

export async function attach(name: string, data: string) {
  const info = test.info()
  // const outDir = info.outputPath('axe-reports')
  // const outPath = path.join(outDir, name)
  const outPath = path.join(info.outputPath(), name)

  // await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(outPath, data, 'utf8')

  info.attachments.push({
    name,
    path: outPath,
    contentType: `application/${path.extname(name)}`,
  })
}
