import test, { Locator } from '@playwright/test'

function getTimeout(timeout: number | undefined) {
  return timeout ?? test.info()?.project.expect?.timeout ?? 5000
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

      await locator.evaluate(() => new Promise(requestAnimationFrame))
    }
  } catch (e) {
    // Nothing to do here.
  } finally {
    clearTimeout(timer)
  }

  return result
}
