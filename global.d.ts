import { RunOptions } from 'axe-core'

declare module '@playwright/test' {
  export interface PlaywrightTestOptions {
    axeOptions?: RunOptions
  }
}

interface MatcherOptions extends RunOptions {
  /**
   * Maximum time in milliseconds, defaults to 5 seconds.
   */
  timeout?: number

  /**
   * Custom report filename
   * @default 'axe-report.html'
   */
  filename?: string
}

interface AxePlaywrightMatchers<R> {
  /**
   * Verifies that the page, frame, or locator is accessible.
   * @param options - Options to pass to axe-core. See the [axe-core documentation](https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter) for more details.
   */
  toHaveNoAxeViolations(options?: MatcherOptions): Promise<R>
}

declare global {
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends AxePlaywrightMatchers<R> {}
  }
}

declare const matchers: AxePlaywrightMatchers
export default matchers
