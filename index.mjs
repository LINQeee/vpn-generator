import axios from 'axios'
import { exec } from 'child_process'
import clipboardy from 'clipboardy'
import iconv from 'iconv-lite'
import PromptSync from 'prompt-sync'
import { connect } from 'puppeteer'
import qp from 'quoted-printable'

const prompt = PromptSync()
const API_URL = 'https://api.mail.tm'
const readEmails = []

const generatePassword = () =>
  Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

let email, password, token, browser

const startChrome = () =>
  new Promise(async (resolve) => {
    exec('pkill -f "Google Chrome"', () => console.log('🔻 Chrome закрыт'))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const chromePath =
      '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome'
    const userDataDir = `${process.env.HOME}/Library/Application Support/Google/Chrome`

    const command = `${chromePath} --remote-debugging-port=9222 --user-data-dir="${userDataDir}"`

    exec(command)
    setTimeout(resolve, 1000)
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

async function getFullEmail(sourceUrl) {
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
    process.exit(0)
  }
}

async function checkEmails() {
  const res = await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const messages = res.data['hydra:member']
    .filter((msg) => !readEmails.includes(msg.sourceUrl))
    .map((msg) => msg.sourceUrl)

  if (messages.length > 0)
    await Promise.all(messages.map((url) => getFullEmail(url)))
}

async function main() {
  await startChrome()

  prompt('Turn on the vpn and press any key')

  await createEmail()
  setInterval(checkEmails, 5000)

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
}

main()
