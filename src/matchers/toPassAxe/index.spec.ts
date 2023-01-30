import { expect, test } from '@playwright/test'
import { attachmentExists } from '../../utils/attachments.js'
import { readFile } from '../../utils/file.js'

test.describe.parallel('toPassAxe', () => {
  test.describe('page', () => {
    test('positive', async ({ page }) => {
      const content = await readFile('accessible.html')
      await page.setContent(content)
      await expect(page).toPassAxe()
    })

    test('negative', async ({ page }) => {
      test.fail()
      const content = await readFile('inaccessible.html')
      await page.setContent(content)
      await expect(page).toPassAxe({ timeout: 2000 })
    })
  })

  test.describe('frame locators', () => {
    test('positive', async ({ page }) => {
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/accessible.html">`
      await page.setContent(content)
      await expect(page.frameLocator('iframe')).toPassAxe()
    })

    test('negative', async ({ page }) => {
      test.fail()
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/inaccessible.html">`
      await page.setContent(content)
      await expect(page.frameLocator('iframe')).toPassAxe({
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
      await expect(frame).toPassAxe()
    })

    test('negative', async ({ page }) => {
      test.fail()
      const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/inaccessible.html">`
      await page.setContent(content)

      const iframe = await page.$('iframe')
      const frame = await iframe!.contentFrame()
      await expect(frame).toPassAxe({ timeout: 2000 })
    })
  })

  test.describe('locator', () => {
    test('positive', async ({ page }) => {
      await page.setContent('<button id="foo">Hello</button>')
      await expect(page.locator('#foo')).toPassAxe()
    })

    test('negative', async ({ page }) => {
      test.fail()
      await page.setContent('<button id="foo"></button>')
      await expect(page.locator('#foo')).toPassAxe({ timeout: 2000 })
    })
  })

  test('should auto-retry assertions', async ({ page }) => {
    await page.setContent('<button id="foo"></button>')

    await Promise.all([
      expect(page.locator('#foo')).toPassAxe(),
      page
        .waitForTimeout(1000)
        .then(() => page.setContent('<button id="foo">Hello</button>')),
    ])
  })

  test('should allow providing custom run options', async ({ page }) => {
    await page.setContent('<button id="foo"></button>')
    await expect(page.locator('#foo')).toPassAxe({
      rules: {
        'button-name': { enabled: false },
      },
    })
  })

  test('should respect project level options', async ({ page }) => {
    await page.setContent('<body><h1></h1></body>')
    await expect(page).toPassAxe()

    await page.setContent('<body><h1></h1></body>')
    await expect(page).not.toPassAxe({
      rules: { 'empty-heading': { enabled: true } },
      timeout: 2000,
    })
  })

  test('should throw an error after the timeout exceeds', async ({ page }) => {
    await page.setContent('<body><button></button></body>')
    const start = Date.now()
    const fn = () => expect(page).toPassAxe({ timeout: 1000 })
    await expect(fn).rejects.toThrowError()

    const duration = Date.now() - start
    expect(duration).toBeGreaterThan(1000)
    expect(duration).toBeLessThan(1500)
  })

  test('default report filename', async ({ page }) => {
    const content = await readFile('inaccessible.html')
    await page.setContent(content)
    await expect(page)
      .toPassAxe({ timeout: 2000 })
      .catch(() => Promise.resolve())
    expect(attachmentExists('axe-report.html')).toBe(true)
  })

  test('should allow providing custom report filename', async ({ page }) => {
    const filename = 'custom-report.html'
    const content = await readFile('inaccessible.html')
    await page.setContent(content)
    await expect(page)
      .toPassAxe({ timeout: 2000, filename })
      .catch(() => Promise.resolve())
    expect(attachmentExists(filename)).toBe(true)
  })

  test.describe('with Axe results object', async () => {
    test('positive', async () => {
      const results = { violations: [] }
      await expect(results).toPassAxe()
    })

    test('negative', async () => {
      const results = { violations: [{ id: 'foo', nodes: [] }] }
      await expect(results).not.toPassAxe()
    })
  })
})
