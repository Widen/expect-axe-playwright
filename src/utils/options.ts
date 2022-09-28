import type { MatcherOptions } from '../types'
import test from '@playwright/test'
import merge from 'merge-deep'

/**
 * Overrides the default options with any user-provided options, and
 * returns the final options object.
 */
export function getOptions(options: MatcherOptions = {}) {
  const info = test.info()
  const opts = merge(info.project.use.axeOptions, options)
  return opts
}
