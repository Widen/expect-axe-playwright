import { createRequire } from 'node:module'

export function resolve(path) {
  const require = createRequire(import.meta.url)
  return require.resolve(path)
}
