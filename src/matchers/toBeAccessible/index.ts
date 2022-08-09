import test from '@playwright/test'
import type { MatcherState } from '@playwright/test/types/expect-types'
import type { AxeResults, Result } from 'axe-core'
import type { MatcherOptions } from '../../types'
import type { Handle } from '../../utils/matcher'
import createHTMLReport from 'axe-reporter-html'
import { attach } from '../../utils/attachments'
import { runAxe } from '../../axe'

const summarize = (violations: Result[]) =>
  violations
    .map((violation) => `${violation.id}(${violation.nodes.length})`)
    .join(', ')

export async function toBeAccessible(
  this: MatcherState,
  handleOrResults: Handle | AxeResults,
  { timeout, filename = 'axe-report.html', ...options }: MatcherOptions = {}
) {
  try {
    let ok: boolean
    let results: AxeResults
    if ((handleOrResults as AxeResults).violations) {
      results = handleOrResults as AxeResults
      ok = !!results.violations.length
    } else {
      ({ ok, results } = await runAxe(handleOrResults as Handle, { timeout, ...options }))
    }

    // If there are violations, attach an HTML report to the test for additional
    // visibility into the issue.
    if (!ok) {
      const html = await createHTMLReport(results)
      const info = test.info()
      await attach(info, filename, html)
    }

    return {
      pass: ok,
      message: () => {
        return (
          this.utils.matcherHint('toBeAccessible', undefined, undefined, this) +
          '\n\n' +
          'Expected: No violations\n' +
          `Received: ${results.violations.length} violations\n\n` +
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
