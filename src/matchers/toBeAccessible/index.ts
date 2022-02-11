import { createHtmlReport } from '@widen/axe-html-reporter'
import type { Result, RunOptions } from 'axe-core'
import type { MatcherState, SyncExpectationResult } from 'expect/build/types'
import { attach } from '../../utils/attachments'
import { injectAxe, runAxe } from '../../utils/axe'
import { Handle, resolveHandle } from '../../utils/matcher'

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
    const { frame, locator } = resolveHandle(handle)
    await injectAxe(frame)
    const results = await runAxe(locator, options)
    const count = results.violations.length

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
