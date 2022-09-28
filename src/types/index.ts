import type { RunOptions } from 'axe-core'

export interface MatcherOptions extends RunOptions {
  timeout?: number
  filename?: string
}
