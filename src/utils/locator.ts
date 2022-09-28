import type { Frame, FrameLocator, Locator, Page } from 'playwright-core'

export type Handle = Page | Frame | FrameLocator | Locator

function isLocator(value: Handle): value is Locator {
  return value.constructor.name === 'Locator'
}

export function resolveLocator(handle: Handle) {
  return isLocator(handle) ? handle : handle.locator('body')
}
