import axios from 'axios'
import { exec, execSync } from 'child_process'
import clipboardy from 'clipboardy'
import iconv from 'iconv-lite'
import PromptSync from 'prompt-sync'
import { connect } from 'puppeteer'
import qp from 'quoted-printable'
import robot from 'robotjs'

const prompt = PromptSync()
const API_URL = 'https://api.mail.tm'
const readEmails = []

const sleep = async (ms) =>
  await new Promise((resolve) => setTimeout(resolve, ms))

const generatePassword = () =>
  Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

let email, password, token, browser, refreshInterval

const startChrome = () =>
  new Promise(async (resolve) => {
    try {
      execSync('pkill -f "Google Chrome"')
      await sleep(1000)
    } catch (e) {}
    const chromePath =
      '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome'
    const userDataDir = `${process.env.HOME}/Library/Application Support/Google/Chrome`

    const command = `${chromePath} --remote-debugging-port=9222 --user-data-dir="${userDataDir}"`

    exec(command)
    await sleep(1000)
    resolve()
  })

async function createEmail() {
  const domainsRes = await axios.get(`${API_URL}/domains`)
  const domain = domainsRes.data['hydra:member'][0].domain
  email = `user${Date.now()}@${domain}`
  password = generatePassword()

  await axios.post(`${API_URL}/accounts`, { address: email, password })

  const res = await axios.post(`${API_URL}/token`, { address: email, password })
  token = res.data.token
  clipboardy.writeSync(email)
  console.log(`🔹 email: ${email}`)
}

async function getFullEmail(sourceUrl, resolve) {
  readEmails.push(sourceUrl)
  const res = await axios.get(`${API_URL}${sourceUrl}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.data.data.includes('Windows')) {
    const url = res.data.data
      .split('background:#1C98D7')[1]
      .split(`href=3D"https://hidemy.e=\r\nsclick.me/`)[1]
      .split('"')[0]
    const page = await browser.newPage()
    await page.goto(`https://hidemy.esclick.me/${url}`)
  } else {
    let resStr = res.data.data.replace(/=\r?\n/g, '')
    const decoded = qp.decode(resStr)
    const utf8res = iconv.decode(Buffer.from(decoded, 'binary'), 'utf-8')
    const code = utf8res.match(/\d{14}/)[0]
    clipboardy.writeSync(code)
    console.log(`${email}:${code}`)
    execSync('pkill -f "Google Chrome"')
    resolve(`${email}:${code}`)
  }
}

async function checkEmails(resolve) {
  const res = await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const messages = res.data['hydra:member']
    .filter((msg) => !readEmails.includes(msg.sourceUrl))
    .map((msg) => msg.sourceUrl)

  if (messages.length > 0)
    await Promise.all(messages.map((url) => getFullEmail(url, resolve)))
}

const getAccount = () =>
  new Promise(async (resolve) => {
    await startChrome()

    prompt('Turn on the vpn and press any key')

    await createEmail()
    refreshInterval = setInterval(() => checkEmails(resolve), 5000)

    browser = await connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null,
    })

    const page = await browser.newPage()
    await page.goto('https://hidxmy.name/demo/')

    await page.evaluate((myEmail) => {
      document.querySelector('input[name=demo_mail]').value = myEmail
      document.querySelector('button[type=submit]').click()
    }, email)
  })

async function main() {
  const account = (await getAccount()).split(':')
  execSync(`open -a "hidemy.name VPN"`)
  focusApp()
  robot.setMouseDelay(200)
  cords = getWindowCoordinates()
  if (!process.argv.includes('--not-logged')) {
    logout()
    robot.mouseClick()
  }
  await login(account[0], account[1])
  process.exit(0)
}

function getWindowCoordinates() {
  const appleScript = `
    tell application "System Events"
        tell application process "hidemy.name VPN"
            set windowPos to position of window 1
            set xPos to item 1 of windowPos
            set yPos to item 2 of windowPos
        end tell
    end tell
    return {xPos, yPos}
  `

  const result = execSync(`osascript -e '${appleScript}'`)
    .toString()
    .trim()
    .split(',')
  return { x: Number(result[0].trim()), y: Number(result[1].trim()) }
}

function focusApp() {
  const script = `tell application "hidemy.name VPN" to activate`
  execSync(`osascript -e '${script}'`)
}

function logout() {
  robot.moveMouseSmooth(cords.x + 30, cords.y + 60, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 30, cords.y + 120, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 30, cords.y + 550, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 30, cords.y + 480, 0.01)
  robot.mouseClick()
}

async function login(email, code) {
  robot.moveMouseSmooth(cords.x + 30, cords.y + 510, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 30, cords.y + 475, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 60, cords.y + 360, 0.01)
  robot.mouseClick()
  robot.typeString(email)
  robot.moveMouseSmooth(cords.x + 60, cords.y + 400, 0.01)
  robot.mouseClick()
  await sleep(100)
  robot.typeString(code)
  robot.moveMouseSmooth(cords.x + 60, cords.y + 500, 0.01)
  robot.mouseClick()
}

let cords

main()
