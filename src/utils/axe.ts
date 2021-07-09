import fs from 'fs'
import type { ElementHandle, Frame, Page } from '@playwright/test'
import type { AxePlugin, AxeResults, RunOptions } from 'axe-core'

declare global {
  interface Window {
    axe: AxePlugin
  }
}

/**
 * Injects the axe-core script into the page if it hasn't already been injected.
 */
export async function injectAxe(frame: Page | Frame) {
  // Exit early if Axe has already been injected.
  if (await frame.evaluate(() => !!window.axe)) {
    return
  }

  // Read the source code from the axe-core library
  const filePath = require.resolve('axe-core/axe.min.js')
  const axe = await fs.promises.readFile(filePath, 'utf-8')

  // Inject the script into the page
  await frame.evaluate((axe) => window.eval(axe), axe)
}

/**
 * Runs axe on an element handle. The script must already be injected
 * using `injectAxe`.
 */
export function runAxe(element: ElementHandle, options: RunOptions) {
  return element.evaluate<AxeResults>(
    (el, options) => window.axe.run(el, options),
    options
  )
}
