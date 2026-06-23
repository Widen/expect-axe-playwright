import { expect, test } from '@playwright/test'
import { isLocator } from './locator.js'

test.describe('isLocator', () => {
  test('identifies a Locator', async ({ page }) => {
    const locator = page.locator('body')
    expect(isLocator(locator)).toBe(true)
  })

  test('rejects a Page', async ({ page }) => {
    expect(isLocator(page as any)).toBe(false)
  })

  test('locator constructor name is Locator or _Locator', async ({ page }) => {
    const locator = page.locator('body')
    const name = locator.constructor.name
    expect(['Locator', '_Locator']).toContain(name)
  })
})
