import http from 'http'
import type { AddressInfo } from 'net'
import { readFile } from '../utils/file'

function listener(req: http.IncomingMessage, res: http.ServerResponse) {
  const file = req.url!.replace('/', '')

  readFile(file).then((html) => {
    res.writeHead(200)
    res.end(html)
  })
}

export default async function globalSetup() {
  const server = http.createServer(listener)
  await new Promise((done) => server.listen(done))

  // Expose port to the tests
  const address = server.address() as AddressInfo
  process.env.SERVER_PORT = String(address.port)

  return async () => {
    await new Promise((done) => server.close(done))
  }
}
