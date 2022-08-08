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

interface ReportOptions {
  attach: 'on' | 'off' | 'retain-on-failure'
  filename?: string
}
type HtmlReportOptions = ReportOptions

interface JsonReportOptions extends ReportOptions {
  space?: number | string
}
interface MatcherOptions extends RunOptions {
  timeout?: number
  filename?: string
  reports?: {
    html?: HtmlReportOptions
    json?: JsonReportOptions
  }
}

const backwardsCompatShouldAttach = (
  ok: boolean,
  opts: MatcherOptions
): boolean => !ok && !opts.reports
const shouldAttach = (ok: boolean, reportOptions?: ReportOptions): boolean =>
  Boolean(
    reportOptions &&
      reportOptions.attach !== 'off' &&
      (reportOptions.attach === 'on' ||
        (!ok && reportOptions.attach === 'retain-on-failure'))
  )

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
    // visibility into the issue. (Unless client has asked for no attachment.)
    if (
      backwardsCompatShouldAttach(ok, opts) ||
      shouldAttach(ok, opts.reports?.html)
    ) {
      const html = await createHTMLReport(results)
      const filename =
        opts.reports?.html?.filename || opts.filename || 'axe-report.html'
      await attach(info, filename, html)
    }

    // Optionally, attach the JSON (used to generate the HTML report)
    if (shouldAttach(ok, opts.reports?.json)) {
      const space = opts.reports?.json?.space ?? 2
      const json = JSON.stringify(results, null, space)
      const jsonFilename = opts.reports?.json?.filename || 'axe-report.json'
      await attach(info, jsonFilename, json)
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
