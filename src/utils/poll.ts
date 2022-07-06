import test, { Locator } from '@playwright/test'

interface TestInfo {
  _expect?: { timeout?: number }
}

function getTimeout(timeout: number | undefined) {
  return timeout ?? (test.info() as TestInfo)?._expect?.timeout ?? 5000
}

export async function poll<T extends { ok: boolean }>(
  locator: Locator,
  timeout: number | undefined,
  predicate: () => Promise<T>
): Promise<T> {
  let result: T = null!
  let expired = false

  const timer = setTimeout(() => {
    expired = true
  }, getTimeout(timeout))

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (expired) return result

      result = await predicate()
      if (expired || result.ok) return result

      // TODO: Figure out a non-flaky way to use RAF.
      // await locator.evaluate(() => new Promise(requestAnimationFrame))
      await locator.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 250))
      )
    }
  } catch (e) {
    // Nothing to do here.
  } finally {
    clearTimeout(timer)
  }

  return result
}
