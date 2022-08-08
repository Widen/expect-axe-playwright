# expect-axe-playwright

[![Build](https://github.com/Widen/expect-axe-playwright/actions/workflows/build.yml/badge.svg)](https://github.com/Widen/expect-axe-playwright/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/expect-axe-playwright)](https://www.npmjs.com/package/expect-axe-playwright)
[![changesets](https://img.shields.io/badge/maintained%20with-changesets-blue)](https://github.com/atlassian/changesets)

Expect matchers to perform Axe accessibility tests in your Playwright tests.

## Installation

### npm

```sh
npm install expect-axe-playwright
```

### Yarn

```
yarn add expect-axe-playwright
```

## Usage

```ts
// playwright.config.ts
import { expect } from '@playwright/test'
import matchers from 'expect-axe-playwright'

expect.extend(matchers)
```

## Why do I need it?

This project was inspired by
[axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) which did a
great job of integrating the [axe-core](https://github.com/dequelabs/axe-core)
library with some simple wrapper functions. However, the API is not as elegant
for testing as would be preferred. That's where `expect-axe-playwright` comes to
the rescue with the following features.

- Direct integration with the `expect` API for simplicity and better error
  messaging.
- Automatic Axe script injection.
- Auto-retry until timeout.
- Works with [pages], [frames], and [locators].
- HTML report with full violation details.
- Project-level option configuration.

Here are a few examples:

```js
await expect(page).toBeAccessible() // Page
await expect(page.locator('#foo')).toBeAccessible() // Locator
await expect(page.frameLocator('iframe')).toBeAccessible() // Frame locator
```

## API Documentation

### `toBeAccessible`

This function checks if a given page, frame, or element handle is accessible.

You can test the entire page:

```js
await expect(page).toBeAccessible()
```

Or pass a locator to test part of the page:

```js
await expect(page.locator('#my-element')).toBeAccessible()
```

#### Axe run options

You can configure options that should be passed to aXe at the project or
assertion level.

To configure a single assertion to use a different set of options, pass an
object with the desired arguments to the matcher.

```js
await expect(page).toBeAccessible({
  rules: {
    'color-contrast': { enabled: false },
  },
})
```

To configure the entire project to use a different set of options, specify
options in `use.axeOptions` in your Playwright config file.

```ts
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  use: {
    axeOptions: {
      rules: {
        'color-contrast': { enabled: false },
      },
    },
  },
}

export default config
```

#### Report options

You can configure options that should be passed to the aXe HTML reporter at
the assertion level.

```js
await expect(page.locator('#my-element')).toBeAccessible({
  filename: 'my-report.html',
})
```

This is particularly useful if you need to produce multiple aXe reports within
the same test as it would otherwise keep replacing the same report every time
you run the assertion.

Two report types are supported: HTML and JSON. You can pass options for each
separately:

```js
await expect(page.locator('#my-element')).toBeAccessible({
  reports: {
    html: {
      // By default, this library attaches the HTML report on failure,
      // but you can override this behaviour with attach='on' or 'off'
      attach: 'retain-on-failure', // 'on' | 'off' | 'retain-on-failure'
      filename: 'axe-report-on-my-element.html',
    },
    json: {
      attach: 'on', // 'on' | 'off' | 'retain-on-failure'
      filename: 'axe-report-on-my-element.json',
      space: 0, // third argument to JSON.stringify
    },
  }
})
```

These same options can also be defined at the project level inside the
`axeOptions` object descibed above.

## Thanks

- [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) for the
  inspiration and groundwork laid for using Axe with Playwright.

[pages]: https://playwright.dev/docs/api/class-page
[frames]: https://playwright.dev/docs/api/class-frame
[locators]: https://playwright.dev/docs/api/class-locator
