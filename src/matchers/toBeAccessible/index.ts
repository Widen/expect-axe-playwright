import test from '@playwright/test'
import type { MatcherState } from '@playwright/test/types/expect-types'
import type { AxeResults, Result } from 'axe-core'
import type { MatcherOptions } from '../../types'
import type { Handle } from '../../utils/locator'
import { getOptions } from '../../utils/options'
import createHTMLReport from 'axe-reporter-html'
import { attach } from '../../utils/attachments'
import { waitForAxeResults } from '../../waitForAxeResults'

const summarize = (violations: Result[]) =>
  violations
    .map((violation) => `${violation.id}(${violation.nodes.length})`)
    .join(', ')

async function getResults(obj: Handle | AxeResults, options: MatcherOptions) {
  if ((obj as AxeResults).violations) {
    const results = obj as AxeResults
    return {
      results,
      ok: !results.violations.length,
    }
  } else {
    return waitForAxeResults(obj as Handle, options)
  }
}

export async function toBeAccessible(
  this: MatcherState,
  obj: Handle | AxeResults,
  options: MatcherOptions = {}
) {
  try {
    const { results, ok } = await getResults(obj, options)

    // If there are violations, attach an HTML report to the test for additional
    // visibility into the issue.
    if (!ok) {
      const info = test.info()
      const opts = getOptions(options)
      const html = await createHTMLReport(results)
      const filename = opts.filename || 'axe-report.html'
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
