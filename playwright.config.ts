import { expect, PlaywrightTestConfig } from '@playwright/test'
import { RunOptions } from 'axe-core'
import matchers from './src'

expect.extend(matchers)

declare module '@playwright/test' {
  export interface PlaywrightTestOptions {
    axeOptions?: RunOptions
  }
}

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./src/config/globalSetup'),
  testDir: 'src',
  use: {
    axeOptions: {
      rules: { 'empty-heading': { enabled: false } },
    },
  },
}

export default config
