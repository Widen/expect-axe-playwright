import type { Frame, FrameLocator, Locator, Page } from '@playwright/test'

export type Handle = Page | Frame | FrameLocator | Locator

export function isLocator(value: Handle): value is Locator {
  // Playwright 1.60 switched to an esbuild bundle, which renamed the Locator
  // class from 'Locator' to '_Locator'. Check both names for backward
  // compatibility.
  return (
    value.constructor.name === 'Locator' ||
    value.constructor.name === '_Locator'
  )
}

export function resolveLocator(handle: Handle) {
  return isLocator(handle) ? handle : handle.locator('body')
}
