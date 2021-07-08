import type { Page } from '@playwright/test'
import type { RunOptions } from 'axe-core'
import type { MatcherState, SyncExpectationResult } from 'expect/build/types'
import { injectAxe, runAxe } from '../utils/axe'

export async function toBeAccessible(
  this: MatcherState,
  page: Page,
  options: RunOptions
): Promise<SyncExpectationResult> {
  try {
    await injectAxe(page)
    const results = await runAxe(page, options)
    const count = results.violations.length

    return {
      pass: count === 0,
      message: () => {
        return (
          this.utils.matcherHint('', undefined, undefined, this) +
          '\n\n' +
          'Expected: No accessibility violations\n' +
          `Received: ${count} violations`
        )
      },
    }
  } catch (err) {
    return {
      pass: false,
      message: () => err.message,
    }
  }
}
