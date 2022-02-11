import { RunOptions } from 'axe-core'

interface MatcherOptions extends RunOptions {
  /**
   * Defaults to `'visible'`. Can be either:
   * - `'attached'` - wait for element to be present in DOM.
   * - `'detached'` - wait for element to not be present in DOM.
   * - `'visible'` - wait for element to have non-empty bounding box and no
   *   `visibility:hidden`. Note that element without any content or with
   *   `display:none` has an empty bounding box and is not considered visible.
   * - `'hidden'` - wait for element to be either detached from DOM, or have
   *   an empty bounding box or `visibility:hidden`. This is opposite to the
   *   `'visible'` option.
   */
  state?: 'attached' | 'detached' | 'visible' | 'hidden'
  /**
   * Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable
   * timeout. The default value can be changed by using the
   * [browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
   * or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.
   */
  timeout?: number
}

interface AxePlaywrightMatchers<R> {
  /**
   * Verifies that the page or element is accessible.
   */
  toBeAccessible(options?: MatcherOptions): Promise<R>
  /**
   * Verifies that the element identified by the given selector is accessible.
   */
  toBeAccessible(selector: string, options?: MatcherOptions): Promise<R>
}

declare global {
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends AxePlaywrightMatchers<R> {}
  }
}

declare const matchers: AxePlaywrightMatchers
export default matchers
