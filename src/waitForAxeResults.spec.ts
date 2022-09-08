import { expect, test } from "@playwright/test"
import { readFile } from "./utils/file"
import { waitForAxeResults } from './waitForAxeResults'

test.describe("waitForAxeResults", () => {
  test("should be ok for page with no axe violations", async ({ page }) => {
    const content = await readFile("accessible.html")
    await page.setContent(content)
    const { ok, results } = await waitForAxeResults(page)
    expect(results.violations).toHaveLength(0)
    expect(ok).toBe(true)
  })

  test("should not be ok for page with axe violations", async ({ page }) => {
    const content = await readFile("inaccessible.html")
    await page.setContent(content)
    const { ok, results } = await waitForAxeResults(page)
    expect(results.violations.length).toBeGreaterThan(0)
    expect(ok).toBe(false)
  })
})
