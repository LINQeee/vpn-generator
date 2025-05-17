import { connect } from 'puppeteer'
import { startChrome } from './lib/chromeUtils.js'
import {
  confirmMail,
  createEmail as createMail,
  waitForCode,
} from './lib/mailUtils.js'
import { activateTroywell } from './lib/troywellActivator.js'
import { goto } from './lib/utils.js'
import { activateVPN } from './lib/vpnActivator.js'

async function main() {
  await startChrome()

  const browser = await connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null,
    protocolTimeout: 500000,
  })
  await activateTroywell(browser)
  const mail = await createMail(browser)

  const page = await browser.newPage()
  await goto(page, 'https://hidxmy.name/demo/')

  await page.evaluate(async (myMail) => {
    document.querySelector('input[name=demo_mail]').value = myMail
  }, mail)
  await page.click('button[type=submit]')
  await confirmMail()
  const code = await waitForCode()

  activateVPN(mail, code)
}

main()
