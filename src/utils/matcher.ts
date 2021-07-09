import type { Page, Frame, ElementHandle } from '@playwright/test'
import type { MatcherOptions } from '../../global'

type Handle = Page | Frame | ElementHandle
export type InputType = Handle | Promise<Handle>

function isElementHandle(value: Handle): value is ElementHandle {
  return value.constructor.name === 'ElementHandle'
}

async function getFrame(value: InputType) {
  const resolved = await value
  return isElementHandle(resolved) ? resolved.contentFrame() : resolved
}

export type InputArguments = [InputType, string?]

const isObject = (value: unknown) => typeof value === 'object'

export async function getElementHandle(args: InputArguments) {
  // Pluck the options off the end first
  const options =
    args.length > 1 && isObject(args[args.length - 1])
      ? (args.pop() as MatcherOptions)
      : {}

  // Then, we can find the element handle
  const handle = await args[0]
  let elementHandle = (await getFrame(handle)) ?? handle

  // If the user provided a page or iframe, we need to locate the provided
  // selector or the `html` element if none was provided.
  if (!isElementHandle(elementHandle)) {
    const selector = args[1] ?? 'html'

    try {
      elementHandle = (await elementHandle.waitForSelector(selector, options))!
    } catch (err) {
      throw new Error(`Timeout exceed for element "${selector}"`)
    }
  }

  return [elementHandle, options] as const
}
