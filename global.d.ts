import { RunOptions } from 'axe-core'

declare module '@playwright/test' {
  export interface PlaywrightTestOptions {
    axeOptions?: RunOptions
  }
}

interface AxePlaywrightMatchers<R> {
  /**
   * Verifies that the page, frame, or locator is accessible.
   * @param options - Options to pass to axe-core. See the [axe-core documentation](https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter) for more details.
   */
  toBeAccessible(options?: RunOptions): Promise<R>
}

declare global {
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends AxePlaywrightMatchers<R> {}
  }
}

declare const matchers: AxePlaywrightMatchers
export default matchers
