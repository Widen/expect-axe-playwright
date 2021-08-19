import type { Page, Frame, ElementHandle, Locator } from '@playwright/test'
import type { MatcherOptions } from '../../global'

type Handle = Page | Frame | Locator | ElementHandle
export type InputType = Handle | Promise<Handle>

function isElementHandle(value: Handle): value is ElementHandle {
  return value.constructor.name === 'ElementHandle'
}

function isLocator(value: Handle): value is Locator {
  return value.constructor.name === 'Locator'
}

async function getFrame(value: InputType) {
  const resolved = await value
  return isElementHandle(resolved) ? resolved.contentFrame() : resolved
}

export type InputArguments = [InputType, string?]

const isObject = (value: unknown) => typeof value === 'object'

export async function getElementHandle(args: InputArguments) {
  // Pluck the options off the end first
  const { timeout, state, ...options } =
    args.length > 1 && isObject(args[args.length - 1])
      ? (args.pop() as MatcherOptions)
      : ({} as MatcherOptions)

  // Then, we can find the element handle
  let handle = await args[0]
  handle = (await getFrame(handle)) ?? handle

  // If the user provided a page or iframe, we need to locate the provided
  // selector or the `html` element if none was provided.
  if (isLocator(handle)) {
    handle = (await handle.elementHandle())!
  } else if (!isElementHandle(handle)) {
    const selector = args[1] ?? 'html'

    try {
      handle = (await handle.waitForSelector(selector, { state, timeout }))!
    } catch (err) {
      throw new Error(`Timeout exceed for element "${selector}"`)
    }
  }

  return [handle, options] as const
}
