interface AxePlaywrightMatchers<R> {
  toBeAccessible(): Promise<R>
}

declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends AxePlaywrightMatchers<R> {}
  }

  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Matchers<R> extends AxePlaywrightMatchers<R> {}
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const matchers: any
