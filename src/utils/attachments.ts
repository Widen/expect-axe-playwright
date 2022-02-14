import path from 'path'
import fs from 'fs/promises'
import { TestInfo } from '@playwright/test'

export async function attach(info: TestInfo, name: string, data: string) {
  const outPath = path.join(info.outputPath(), name)
  await fs.writeFile(outPath, data, 'utf8')

  // So..., Playwright says not to do this, but `TestInfo.attach` hashes the
  // filename making the user experience pretty terrible.
  info.attachments.push({
    name,
    path: outPath,
    contentType: `application/${path.extname(name)}`,
  })
}
