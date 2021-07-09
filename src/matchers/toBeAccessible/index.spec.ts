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

  test('should allow providing custom run options', async ({ page }) => {
    await page.setContent('<button id="foo"></button>')
    await expect(page).toBeAccessible('#foo', {
      rules: {
        'button-name': { enabled: false },
      },
    })
  })

  test('should throw an error after the timeout exceeds', async ({ page }) => {
    const start = Date.now()
    const fn = () => expect(page).toBeAccessible('button', { timeout: 1000 })
    await expect(fn).rejects.toThrowError()

    const duration = Date.now() - start
    expect(duration).toBeGreaterThan(1000)
    expect(duration).toBeLessThan(1500)
  })
})
