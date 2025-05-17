import { sleep } from './utils.js'

let secMailPage
let mail
let browser

export const createEmail = async (_browser) => {
  browser = _browser
  secMailPage = await browser.newPage()
  await secMailPage.goto('https://www.1secmail.cc/delete')
  mail = await secMailPage.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const getInput = () => document.querySelector('#trsh_mail')
    while (
      !getInput() ||
      (getInput() && getInput().value.includes('Loading'))
    ) {
      await sleep(150)
    }
    const emailInput = getInput()
    return emailInput.value
  })
  return mail
}

export const waitForCode = async () => {
  await sleep(60000)
  const msgUrl = await waitForMessage(2)
  const msgPage = await browser.newPage()
  await msgPage.goto(msgUrl)
  const code = await msgPage.evaluate(() => {
    return document.querySelectorAll('span')[1].textContent.split(':')[1].trim()
  })
  await msgPage.close()
  return code
}

export const confirmMail = async () => {
  const msgUrl = await waitForMessage(1)
  const msgPage = await browser.newPage()
  await msgPage.goto(msgUrl)
  const confirmMailUrl = await msgPage.evaluate(() => {
    return document.querySelector('.es-button').href
  })
  console.log(confirmMailUrl)
  await msgPage.close()
  const confirmPage = await browser.newPage()
  await confirmPage.goto(confirmMailUrl)
  await confirmPage.close()
}

const waitForMessage = (_msgNum) =>
  secMailPage.evaluate(async (msgNum) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const getMessages = () => document.querySelectorAll('.message-item')
    while (getMessages().length < msgNum) {
      await sleep(150)
    }
    return getMessages()[0].querySelector('a').href.replace('view', 'message')
  }, _msgNum)
