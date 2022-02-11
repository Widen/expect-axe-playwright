import test from '@playwright/test'
import merge from 'merge-deep'
import { createHtmlReport } from 'axe-reporter-html'
import type { Result, RunOptions } from 'axe-core'
import type { MatcherState, SyncExpectationResult } from 'expect/build/types'
import { attach } from '../../utils/attachments'
import { injectAxe, runAxe } from '../../utils/axe'
import { Handle, resolveLocator } from '../../utils/matcher'

const summarize = (violations: Result[]) =>
  violations
    .map((violation) => `${violation.id}(${violation.nodes.length})`)
    .join(', ')

export async function toBeAccessible(
  this: MatcherState,
  handle: Handle,
  options?: RunOptions
): Promise<SyncExpectationResult> {
  try {
    const locator = resolveLocator(handle)
    await injectAxe(locator)

    const opts = merge(test.info().project.use.axeOptions, options)
    const results = await runAxe(locator, opts)
    const count = results.violations.length

    // If there are violations, attach an HTML report to the test for additional
    // visibility into the issue.
    if (count) {
      const html = createHtmlReport({
        results,
        options: { doNotCreateReportFile: true },
      })

      await attach('axe-report.html', html)
    }

    return {
      pass: count === 0,
      message: () => {
        return (
          this.utils.matcherHint('toBeAccessible', undefined, undefined, this) +
          '\n\n' +
          'Expected: No violations\n' +
          `Received: ${count} violations\n\n` +
          `Violations: ${summarize(results.violations)}`
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
