import test, { Locator } from '@playwright/test'

export async function poll<T extends { ok: boolean }>(
  locator: Locator,
  predicate: () => Promise<T>
): Promise<T> {
  let expired = false
  const timeout = test.info()?.project.expect?.timeout ?? 5000
  const timer = setTimeout(() => {
    expired = true
  }, timeout)

  let result: T = null!

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (expired) return result

      result = await predicate()
      if (expired || result.ok) return result

      await locator.evaluate(() => new Promise(requestAnimationFrame))
    }
  } catch (e) {
    // ...
  } finally {
    clearTimeout(timer)
  }

  return result
}
