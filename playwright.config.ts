import { expect, PlaywrightTestConfig } from '@playwright/test'
import { matchers } from './src'

expect.extend(matchers)

export default {
  testDir: 'src',
} as PlaywrightTestConfig
