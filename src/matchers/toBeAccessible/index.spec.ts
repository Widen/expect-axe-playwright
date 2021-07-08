import { expect, test } from '@playwright/test'
import { readFile } from '../../utils/file'

test.describe('toBeAccessible', () => {
  test.describe('page', () => {
    test('positive', async ({ page }) => {
      const content = await readFile('accessible.html')
      await page.setContent(content)
      await expect(page).toBeAccessible()
    })

    test('negative', async ({ page }) => {
      test.fail()
      const content = await readFile('inaccessible.html')
      await page.setContent(content)
      await expect(page).toBeAccessible()
    })
  })

  test.describe('selector', () => {
    test('positive', async ({ page }) => {
      await page.setContent('<button id="foo">Hello</button>')
      await expect(page).toBeAccessible('#foo')
    })

    test('negative', async ({ page }) => {
      test.fail()
      await page.setContent('<button id="foo"></button>')
      await expect(page).toBeAccessible('#foo')
    })
  })

  test.describe('element', () => {
    test('positive', async ({ page }) => {
      await page.setContent('<button id="foo">Hello</button>')
      const button = page.$('#foo')

      await expect(button).toBeAccessible()
      await expect(await button).toBeAccessible()
    })

    test('negative', async ({ page }) => {
      test.fail()
      await page.setContent('<button id="foo"></button>')
      const button = page.$('#foo')

      await expect(button).toBeAccessible()
      await expect(await button).toBeAccessible()
    })
  })

  test.describe('iframe', () => {
    test('positive', async ({ page }) => {
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/accessible.html">`
      await page.setContent(content)

      const handle = page.$('iframe')
      await expect(handle).toBeAccessible()
      await expect(await handle).toBeAccessible()

      const iframe = (await handle)?.contentFrame()
      await expect(iframe).toBeAccessible()
      await expect(await iframe).toBeAccessible()
    })

    test('negative', async ({ page }) => {
      test.fail()
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/inaccessible.html">`
      await page.setContent(content)

      const handle = page.$('iframe')
      await expect(handle).toBeAccessible()
      await expect(await handle).toBeAccessible()

      const iframe = (await handle)?.contentFrame()
      await expect(iframe).toBeAccessible()
      await expect(await iframe).toBeAccessible()
    })
  })
})
