import test from '@playwright/test'
import type { MatcherState } from '@playwright/test/types/expect-types'
import type { Result, RunOptions } from 'axe-core'
import createHTMLReport from 'axe-reporter-html'
import merge from 'merge-deep'
import { attach } from '../../utils/attachments'
import { injectAxe, runAxe } from '../../utils/axe'
import { Handle, resolveLocator } from '../../utils/matcher'
import { poll } from '../../utils/poll'

const summarize = (violations: Result[]) =>
  violations
    .map((violation) => `${violation.id}(${violation.nodes.length})`)
    .join(', ')

interface MatcherOptions extends RunOptions {
  timeout?: number
  filename?: string
}

export async function toBeAccessible(
  this: MatcherState,
  handle: Handle,
  { timeout, ...options }: MatcherOptions = {}
) {
  try {
    const locator = resolveLocator(handle)
    await injectAxe(locator)

    const info = test.info()
    const opts = merge(info.project.use.axeOptions, options)

    const { ok, results } = await poll(locator, timeout, async () => {
      const results = await runAxe(locator, opts)

      return {
        ok: !results.violations.length,
        results,
      }
    })

    // If there are violations, attach an HTML report to the test for additional
    // visibility into the issue.
    if (!ok) {
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
