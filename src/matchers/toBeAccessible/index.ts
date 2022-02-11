import { Frame } from '@playwright/test'
import type { Result, RunOptions } from 'axe-core'
import type { MatcherState, SyncExpectationResult } from 'expect/build/types'
import { injectAxe, runAxe } from '../../utils/axe'
import { Handle, isLocator } from '../../utils/matcher'

const collectViolations = (violations: Result[]) =>
  violations
    .map((violation) => `${violation.id}(${violation.nodes.length})`)
    .join(', ')

export async function toBeAccessible(
  this: MatcherState,
  handle: Handle,
  options?: RunOptions
): Promise<SyncExpectationResult> {
  try {
    const locator = isLocator(handle) ? handle : handle.locator('body')
    const frame = (locator as unknown as { _frame: Frame })._frame

    await injectAxe(frame)
    const results = await runAxe(locator, options)
    const count = results.violations.length

    return {
      pass: count === 0,
      message: () => {
        return (
          this.utils.matcherHint('toBeAccessible', undefined, undefined, this) +
          '\n\n' +
          'Expected: No violations\n' +
          `Received: ${count} violations\n\n` +
          `Violations: ${collectViolations(results.violations)}`
        )
      },
    }
  } catch (err) {
    return {
      pass: false,
      message: () => (err as Error).message,
    }
  }
}
