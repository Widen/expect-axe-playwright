import { expect, test } from '@playwright/test'

test.describe('toBeAccessible', () => {
  test('positive', async ({ page }) => {
    await page.setContent('')
    await page.goto('https://playwright.dev/')
    await expect(page).toBeAccessible()
  })

  test('negative', async ({ page }) => {
    await page.setContent('')
  })
})
