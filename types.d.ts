export interface AxePlaywrightMatchers<R> {
  toBeAccessible(): Promise<R>
}

declare global {
  namespace jest {
    type Matchers<R> = AxePlaywrightMatchers<R>
  }

  namespace PlaywrightTest {
    type Matchers<R> = AxePlaywrightMatchers<R>
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const matchers: any
