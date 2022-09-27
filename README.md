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
await expect(page).toPassAxe() // Page
await expect(page.locator('#foo')).toPassAxe() // Locator
await expect(page.frameLocator('iframe')).toPassAxe() // Frame locator
```

## API Documentation

### `toPassAxe`

This function checks if a given page, frame, or element handle passes a set of accessibility checks.

You can test the entire page:

```js
await expect(page).toPassAxe()
```

Or pass a locator to test part of the page:

```js
await expect(page.locator('#my-element')).toPassAxe()
```

#### Word of Caution: Limitations to Accessibility Tests

```js
toPassAxe() !== toBeAccessible()
```

It's important to keep in mind that if your page passes the set of accessibility
checks that you've configured for Axe, that does not mean that your page is free
of all accessibility barriers.

In fact, automated testing can only catch a fraction of the most common kinds of
accessibility errors.

Accessibility is analogous in ways to security. Imagine the following code:

```js
expect(myApp).toBeSecure()
```

It's very hard to say that anything is secure because you never know when
someone is going to uncover a security vulnerability in your code. Similarly,
it's very hard to say that anything you've built is totally accessible because
you never know when somebody will uncover a barrier you didn't know was there.

Furthermore, of the commonly known accessibility barriers, only some can be
found through automated testing, which is then further subject to the
effectiveness of the checker being used. A 2017 study on the [effectiveness of
automated accessibility testing
tools](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/)
by the UK's Government Digital Service confirms this.

To echo [jest-axe](https://github.com/NickColley/jest-axe), tools like Axe are
similar to code linters and spell checkers: they can find common issues but
cannot guarantee that what you build works for users.

You'll also need to:

- test your interface with the [assistive technologies that real users
  use](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies#when-to-test)
  (see also [WebAIM's survey
  results](https://webaim.org/projects/screenreadersurvey8/#primary)).
- include disabled people in user research.

#### Axe run options

You can configure options that should be passed to aXe at the project or
assertion level.

To configure a single assertion to use a different set of options, pass an
object with the desired arguments to the matcher.

```js
await expect(page).toPassAxe({
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
await expect(page.locator('#my-element')).toPassAxe({
  filename: 'my-report.html',
})
```

This is particularly useful if you need to produce multiple aXe reports within
the same test as it would otherwise keep replacing the same report every time
you run the assertion.

## Thanks

- [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) for the
  inspiration and groundwork laid for using Axe with Playwright.

[pages]: https://playwright.dev/docs/api/class-page
[frames]: https://playwright.dev/docs/api/class-frame
[locators]: https://playwright.dev/docs/api/class-locator
