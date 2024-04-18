import { expect, PlaywrightTestConfig } from '@playwright/test'
import { RunOptions } from 'axe-core'
import { fileURLToPath } from 'node:url'
import matchers from './src/index.js'

expect.extend(matchers)

declare module '@playwright/test' {
  export interface PlaywrightTestOptions {
    axeOptions?: RunOptions
  }
}

const config: PlaywrightTestConfig = {
  retries: process.env.CI ? 2 : 0,
  globalSetup: fileURLToPath(
    new URL('./src/config/globalSetup.ts', import.meta.url),
  ),
  testDir: './src',
  use: {
    axeOptions: {
      rules: { 'empty-heading': { enabled: false } },
    },
  },
}

export default config
