import { test, expect } from '@playwright/test'
import type { AxeResults, Result } from 'axe-core'
import type { MatcherOptions } from '../../types/index.js'
import type { Handle } from '../../utils/locator.js'
import { getOptions } from '../../utils/options.js'
import createHTMLReport from 'axe-reporter-html'
import { attach } from '../../utils/attachments.js'
import { waitForAxeResults } from '../../waitForAxeResults.js'

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

export async function toPassAxe(
  this: ReturnType<(typeof expect)['getState']>,
  obj: Handle | AxeResults,
  options: MatcherOptions = {},
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
          this.utils.matcherHint('toPassAxe', undefined, undefined, this) +
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
