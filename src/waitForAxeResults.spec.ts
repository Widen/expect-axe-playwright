import { expect, test } from "@playwright/test"
import { readFile } from "./utils/file"
import { waitForAxeResults } from './waitForAxeResults'

test.describe("waitForAxeResults", () => {
  test("should be ok for page with no axe violations", async ({ page }) => {
    const content = await readFile("accessible.html")
    await page.setContent(content)
    const { ok } = await waitForAxeResults(page)
    await expect(ok).toBeTruthy()
  })

  test("should not be ok for page with axe violations", async ({ page }) => {
    const content = await readFile("inaccessible.html");
    await page.setContent(content);
    const { ok } = await waitForAxeResults(page)
    await expect(ok).toBeFalsy()
  })
})
