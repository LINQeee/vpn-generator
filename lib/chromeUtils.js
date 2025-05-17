import { exec, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { sleep } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const extensionPath = path.join(__dirname, '../', 'troywell-extension')

const chromeProfileDir = path.join(
  process.env.HOME || '',
  'Library/Application Support/Google/Chrome/VpnUser'
)

export const startChrome = async () => {
  console.log(extensionPath)
  if (!fs.existsSync(chromeProfileDir)) {
    fs.mkdirSync(chromeProfileDir, { recursive: true })
  }
  try {
    execSync('pkill -f "Google Chrome"')
    await sleep(1000)
  } catch {}

  const chromePath =
    '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome'
  const userDataDir = `${process.env.HOME}/Library/Application Support/Google/Chrome/VpnUser`

  const command = `${chromePath} --remote-debugging-port=9222 --user-data-dir="${userDataDir}" --load-extension="${extensionPath}"`

  exec(command)
  await sleep(1000)
}
