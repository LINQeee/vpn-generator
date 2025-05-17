import { sleep } from './utils.js'

export const activateTroywell = async (browser) => {
  const page = await browser.newPage()
  await page.goto(
    'chrome-extension://adlpodnneegcnbophopdmhedicjbcgco/popup.html',
    { waitUntil: 'domcontentloaded' }
  )
  await sleep(1000)
  await page.evaluate(async () => {
    const getConnectBtn = () => document.querySelector('div.connect-button')
    const getDisconnectBtn = () =>
      document.querySelector(
        '.connection-block__connection.connection-block__connection_row'
      )

    while (!getConnectBtn() && !getDisconnectBtn()) {
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
    const disconnectButton = getDisconnectBtn()
    if (disconnectButton) {
      getConnectBtn().click()
      while (getDisconnectBtn()) {
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    }
    getConnectBtn().click()
    while (!getDisconnectBtn()) {
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  })
}
