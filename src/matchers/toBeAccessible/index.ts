import type { Result } from 'axe-core'
import type { MatcherState, SyncExpectationResult } from 'expect/build/types'
import { injectAxe, runAxe } from '../../utils/axe'
import { getElementHandle, InputArguments } from '../../utils/matcher'

const collectViolations = (violations: Result[]) =>
  violations
    .map((violation) => `${violation.id}(${violation.nodes.length})`)
    .join(', ')

export async function toBeAccessible(
  this: MatcherState,
  ...args: InputArguments
): Promise<SyncExpectationResult> {
  try {
    const [elementHandle] = await getElementHandle(args)
    const frame = (await elementHandle.ownerFrame())!

    await injectAxe(frame)
    const results = await runAxe(elementHandle, {})
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
      message: () => err.message,
    }
  }
}
