import test from "@playwright/test";
import type { AxeResults, RunOptions } from "axe-core";
import { Handle, resolveLocator } from "./utils/locator";
import merge from "merge-deep";
import { poll } from "./utils/poll";
import { injectAxe, runAxe } from "./utils/axe";

/**
 * Injects axe onto page, waits for the page to be ready, then runs axe against
 * the provided element handle (which could be the entire page).
 */
export async function waitForAxeResults(
  handle: Handle,
  { timeout, ...options }: { timeout?: number } & RunOptions = {}
): Promise<{
  ok: boolean;
  results: AxeResults;
}> {
  const info = test.info();
  const opts = merge(info.project.use.axeOptions, options);
  const locator = resolveLocator(handle);
  await injectAxe(locator);
  return poll(locator, timeout, async () => {
    const results = await runAxe(locator, opts);

    return {
      ok: !results.violations.length,
      results,
    };
  });
}

export default waitForAxeResults
