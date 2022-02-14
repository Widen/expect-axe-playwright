import { Locator } from '@playwright/test'

export async function poll<T extends { ok: boolean }>(
  locator: Locator,
  predicate: () => Promise<T>
): Promise<T> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await predicate()
    if (result.ok) return result

    await locator.evaluate(() => new Promise(requestAnimationFrame))
  }
}
