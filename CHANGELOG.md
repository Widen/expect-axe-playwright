# expect-axe-playwright

## 2.2.1

### Patch Changes

- 7ad6287: Inject axe even if there is an element with an id of `axe`.

## 2.2.0

### Minor Changes

- b1b5d23: Support custom report filenames via toBeAccessible

## 2.1.0

### Minor Changes

- aaedb48: Update HTML report output.

## 2.0.1

### Patch Changes

- 0e06ed1: Add `engines` to package.json to enforce Node version 14 or greater.

## 2.0.0

### Major Changes

- 72e890d: Remove support for jest-playwright.
- 72e890d: Remove support for resolving iframes from element handles. Please use [`FrameLocator`s](https://playwright.dev/docs/api/class-framelocator) instead.

  ```diff
  -expect(page.$('iframe')).toBeAccessible()
  +expect(page.frameLocator('iframe')).toBeAccessible()
  ```

- 72e890d: Remove support for element handles. Please use locators instead.

  ```diff
  -expect(page.$('button')).toBeAccessible()
  +expect(page.locator('button')).toBeAccessible()
  ```

- 72e890d: Make `matchers` the default export.

  ```diff
  -import { matchers } from 'expect-axe-playwright'
  +import matchers from 'expect-axe-playwright'
  ```

### Minor Changes

- 72e890d: Attach HTML report with full violation details to each failed test.
- 72e890d: Add ability to configure default rule settings in the Playwright config file.

## 1.2.1

### Patch Changes

- 5dd7dde: Update docs to reflect migration to changesets.
