import type { Frame, Locator, Page } from '@playwright/test'

export type Handle = Page | Frame | Locator

function isLocator(value: Handle): value is Locator {
  return value.constructor.name === 'Locator'
}

export function resolveHandle(handle: Handle) {
  const locator = isLocator(handle) ? handle : handle.locator('body')
  const frame = (locator as unknown as { _frame: Frame })._frame

  return { locator, frame }
}
