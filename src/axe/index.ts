import type { AxeResults, RunOptions } from 'axe-core'
import test from '@playwright/test'
import merge from 'merge-deep'
import { injectAxe, runAxeAfterInject } from '../utils/axe'
import { Handle, resolveLocator } from '../utils/matcher'
import { poll } from '../utils/poll'

export async function runAxe(
  handle: Handle,
  { timeout, ...options }: { timeout: number | undefined } & RunOptions
): Promise<{
  ok: boolean
  results: AxeResults
}> {
  const info = test.info()
  const opts = merge(info.project.use.axeOptions, options)
  const locator = resolveLocator(handle)
  await injectAxe(locator)
  return await poll(locator, timeout, async () => {
    const results = await runAxeAfterInject(locator, opts)

    return {
      ok: !results.violations.length,
      results,
    }
  })
}
