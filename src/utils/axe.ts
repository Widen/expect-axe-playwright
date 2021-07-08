import fs from 'fs'
import type { Page } from '@playwright/test'
import { AxePlugin, AxeResults, RunOptions } from 'axe-core'

declare global {
  interface Window {
    axe: AxePlugin
  }
}

/**
 * Injects the axe-core script into the page if it hasn't already been injected.
 */
export async function injectAxe(page: Page): Promise<void> {
  // Exit early if Axe has already been injected.
  if (await page.evaluate(() => !!window.axe)) {
    return
  }

  // Read the source code from the axe-core library
  const filePath = require.resolve('axe-core/axe.min.js')
  const axe = await fs.promises.readFile(filePath, 'utf-8')

  // Inject the script into the page
  await page.evaluate((axe) => window.eval(axe), axe)
}

/**
 * Runs axe on the page. The script must already be injected using `injectAxe`.
 */
export function runAxe(
  page: Page,
  options: RunOptions = {}
): Promise<AxeResults> {
  return page.evaluate<AxeResults>(
    (options) => window.axe.run(window.document, options),
    options
  )
}
