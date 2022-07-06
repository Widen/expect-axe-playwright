import type { Locator } from '@playwright/test'
import type { AxePlugin, AxeResults, RunOptions } from 'axe-core'
import fs from 'fs'

declare global {
  interface Window {
    axe: AxePlugin
  }
}

/**
 * Injects the axe-core script into the page if it hasn't already been injected.
 */
export async function injectAxe(locator: Locator) {
  // Exit early if Axe has already been injected. Test for `window.axe.run` to
  // prevent a false positive if there is an element with `id="axe"`.
  if (await locator.evaluate(() => !!window.axe?.run)) {
    return
  }

  // Read the source code from the axe-core library
  const filePath = require.resolve('axe-core/axe.min.js')
  const axe = await fs.promises.readFile(filePath, 'utf-8')

  // Inject the script into the page
  await locator.evaluate((_, axe) => window.eval(axe), axe)
}

/**
 * Runs axe on an element handle. The script must already be injected
 * using `injectAxe`.
 */
export function runAxe(locator: Locator, options: RunOptions = {}) {
  return locator.evaluate<AxeResults, RunOptions>(
    (el, options) => window.axe.run(el, options),
    options
  )
}
