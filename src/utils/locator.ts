import type { Frame, FrameLocator, Locator, Page } from '@playwright/test'

export type Handle = Page | Frame | FrameLocator | Locator

function isLocator(value: Handle): value is Locator {
  return value.constructor.name === 'Locator'
}

export function resolveLocator(handle: Handle) {
  return isLocator(handle) ? handle : handle.locator('body')
}
