import type { Page, Frame, ElementHandle } from '@playwright/test'

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

const isObject = (value: unknown) =>
  typeof value === 'object' && !(value instanceof RegExp)

export async function getElementHandle(args: InputArguments) {
  // Finally, we can find the element handle
  const handle = await args[0]
  let elementHandle = (await getFrame(handle)) ?? handle

  // If the user provided a page or iframe, we need to locate the provided
  // selector or the `html` element if none was provided.
  if (!isElementHandle(elementHandle)) {
    const selector = args[1] ?? 'html'

    try {
      elementHandle = (await elementHandle.waitForSelector(selector))!
    } catch (err) {
      throw new Error(`Timeout exceed for element "${selector}"`)
    }
  }

  return [elementHandle, {}] as const
}
