import type { Frame, Locator, Page } from '@playwright/test'

export type Handle = Page | Frame | Locator

export function isLocator(value: Handle): value is Locator {
  return value.constructor.name === 'Locator'
}
