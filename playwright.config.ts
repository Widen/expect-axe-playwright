import { expect, PlaywrightTestConfig } from '@playwright/test'
import matchers from './src'

expect.extend(matchers)

export default {
  globalSetup: require.resolve('./src/config/globalSetup'),
  testDir: 'src',
} as PlaywrightTestConfig
