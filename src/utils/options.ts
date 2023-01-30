import type { MatcherOptions } from '../types/index.js'
import { test } from '@playwright/test'
import merge from 'merge-deep'

/**
 * Overrides the default options with any user-provided options, and
 * returns the final options object.
 */
export function getOptions(options: MatcherOptions = {}) {
  const info = test.info()
  return merge(info.project.use.axeOptions, options)
}
