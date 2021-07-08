import type { SyncExpectationResult, MatcherState } from 'expect/build/types'
import fs from 'fs'
import type { Page } from '@playwright/test'

async function injectAxe(page: Page) {
  // Don't do anything if the axe-core script has already been injected.
  if (await page.$('script[data-axe]')) {
    return
  }

  const filePath = require.resolve('axe-core/axe.min.js')
  const axe = await fs.promises.readFile(filePath, 'utf-8')

  // Inject the script into the page
  await page.evaluate((axe) => window.eval(axe), axe)
}

export async function toBeAccessible(
  this: MatcherState,
  page: Page
): Promise<SyncExpectationResult> {
  try {
    await injectAxe()
    // const [elementHandle] = await getElementHandle(args, 0)
    // const isDisabled = await elementHandle.isDisabled()

    return {
      pass: isDisabled,
      message: () => getMessage(this, 'toBeDisabled', true, isDisabled, ''),
    }
  } catch (err) {
    return {
      pass: false,
      message: () => err.toString(),
    }
  }
}

export default toBeDisabled
