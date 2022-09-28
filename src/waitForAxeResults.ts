import type { RunOptions } from 'axe-core'
import { Handle, resolveLocator } from './utils/locator'
import { poll } from './utils/poll'
import { injectAxe, runAxe } from './utils/axe'
import { getOptions } from './utils/options'

/**
 * Injects axe onto page, waits for the page to be ready, then runs axe against
 * the provided element handle (which could be the entire page).
 */
export async function waitForAxeResults(
  handle: Handle,
  { timeout, ...options }: { timeout?: number } & RunOptions = {}
) {
  const opts = getOptions(options)
  const locator = resolveLocator(handle)
  await injectAxe(locator)
  return poll(locator, timeout, async () => {
    const results = await runAxe(locator, opts)

    return {
      ok: !results.violations.length,
      results,
    }
  })
}
