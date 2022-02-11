import { expect, test } from '@playwright/test'
import { readFile } from '../../utils/file'

test.describe.parallel('toBeAccessible', () => {
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

  test.describe('frame', () => {
    test('positive', async ({ page }) => {
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/accessible.html">`
      await page.setContent(content)

      const iframe = await page.$('iframe')
      const frame = await iframe!.contentFrame()
      await expect(frame).toBeAccessible()
    })

    test('negative', async ({ page }) => {
      test.fail()
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/inaccessible.html">`
      await page.setContent(content)

      const iframe = await page.$('iframe')
      const frame = await iframe!.contentFrame()
      await expect(frame).toBeAccessible()
    })
  })

  test.describe('locator', () => {
    test('positive', async ({ page }) => {
      await page.setContent('<button id="foo">Hello</button>')
      await expect(page.locator('#foo')).toBeAccessible()
    })

    test('negative', async ({ page }) => {
      test.fail()
      await page.setContent('<button id="foo"></button>')
      await expect(page.locator('#foo')).toBeAccessible()
    })
  })

  test('should allow providing custom run options', async ({ page }) => {
    await page.setContent('<button id="foo"></button>')
    await expect(page.locator('#foo')).toBeAccessible({
      rules: {
        'button-name': { enabled: false },
      },
    })
  })
})
