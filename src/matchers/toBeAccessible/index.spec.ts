import { expect, test } from '@playwright/test'
import { attachmentExists } from '../../utils/attachments'
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
      await expect(page).toBeAccessible({ timeout: 2000 })
    })
  })

  test.describe('frame locators', () => {
    test('positive', async ({ page }) => {
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/accessible.html">`
      await page.setContent(content)
      await expect(page.frameLocator('iframe')).toBeAccessible()
    })

    test('negative', async ({ page }) => {
      test.fail()
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/inaccessible.html">`
      await page.setContent(content)
      await expect(page.frameLocator('iframe')).toBeAccessible({
        timeout: 2000,
      })
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
      await expect(frame).toBeAccessible({ timeout: 2000 })
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
      await expect(page.locator('#foo')).toBeAccessible({ timeout: 2000 })
    })
  })

  test('should auto-retry assertions', async ({ page }) => {
    await page.setContent('<button id="foo"></button>')

    await Promise.all([
      expect(page.locator('#foo')).toBeAccessible(),
      page
        .waitForTimeout(1000)
        .then(() => page.setContent('<button id="foo">Hello</button>')),
    ])
  })

  test('should allow providing custom run options', async ({ page }) => {
    await page.setContent('<button id="foo"></button>')
    await expect(page.locator('#foo')).toBeAccessible({
      rules: {
        'button-name': { enabled: false },
      },
    })
  })

  test('should respect project level options', async ({ page }) => {
    await page.setContent('<body><h1></h1></body>')
    await expect(page).toBeAccessible()

    await page.setContent('<body><h1></h1></body>')
    await expect(page).not.toBeAccessible({
      rules: { 'empty-heading': { enabled: true } },
      timeout: 2000,
    })
  })

  test('should throw an error after the timeout exceeds', async ({ page }) => {
    await page.setContent('<body><button></button></body>')
    const start = Date.now()
    const fn = () => expect(page).toBeAccessible({ timeout: 1000 })
    await expect(fn).rejects.toThrowError()

    const duration = Date.now() - start
    expect(duration).toBeGreaterThan(1000)
    expect(duration).toBeLessThan(1500)
  })

  test('default report filename', async ({ page }) => {
    const content = await readFile('inaccessible.html')
    await page.setContent(content)
    await expect(page)
      .toBeAccessible({ timeout: 2000 })
      .catch(() => Promise.resolve())
    expect(attachmentExists('axe-report.html')).toBe(true)
  })

  test('should allow providing custom report filename', async ({ page }) => {
    const filename = 'custom-report.html'
    const content = await readFile('inaccessible.html')
    await page.setContent(content)
    await expect(page)
      .toBeAccessible({ timeout: 2000, filename })
      .catch(() => Promise.resolve())
    expect(attachmentExists(filename)).toBe(true)
  })

  test.describe('with Axe results object', async () => {
    test('positive', async () => {
      const results = { violations: [] }
      await expect(results).toBeAccessible()
    })

    test('negative', async () => {
      const results = { violations: [{ id: 'foo', nodes: [] }] }
      await expect(results).not.toBeAccessible()
    })
  })
})
