# expect-axe-playwright

[![Build](https://github.com/Widen/expect-axe-playwright/actions/workflows/build.yml/badge.svg)](https://github.com/Widen/expect-axe-playwright/actions/workflows/build.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

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

### With [Playwright test runner](https://playwright.dev/docs/test-intro/)

```ts
// playwright.config.ts
import { expect } from '@playwright/test'
import { matchers } from 'expect-axe-playwright'

expect.extend(matchers)
```

### With Jest

```js
// setup-jest.js
import { matchers } from 'expect-axe-playwright'

expect.extend(matchers)
```

## Why do I need it?

This project was inspired by [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) which did a great job of integrating the [axe-core](https://github.com/dequelabs/axe-core) library with some simple wrapper functions. However, the API is not as elegant for testing as would be preferred. That's where `expect-axe-playwright` comes to the rescue with the following features.

- Direct integration with the `expect` API for simplicity and better error messaging.
- Automatic Axe script injection.
- Works with pages, frames, and element handles.
- Automatic promise and frame resolution.

Here are a few examples:

```js
await expect(page).toBeAccessible() // Page
await expect(page).toBeAccessible('#foo') // Page + selector
await expect(page.$('#foo')).toBeAccessible() // Element handle
await expect(page.$('iframe')).toBeAccessible() // Iframe
```

## API Documentation

### `toBeAccessible`

This function checks if a given page, frame, or element handle is accessible.

You can test the entire page:

```js
await expect(page).toBeAccessible()
```

Or pass a selector to test part of the page:

```js
await expect(element).toBeAccessible('#my-element')
```

Or pass a Playwright [ElementHandle]:

```js
const element = await page.$('#my-element')
await expect(element).toBeAccessible()
```

## Thanks

- [expect-playwright](https://github.com/playwright-community/expect-playwright) for the rock solid foundation for writing Playwright matchers.
- [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) for the inspiration and groundwork laid for using Axe with Playwright.

[elementhandle]: https://playwright.dev/docs/api/class-elementhandle/
