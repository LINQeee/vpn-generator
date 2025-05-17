import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logo = fs.readFileSync(path.resolve(__dirname, './logo.txt'), {
  encoding: 'utf8',
})

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const goto = async (page, url) => {
  await page.goto(url)
  await page.evaluate((_logo) => {
    const pre = document.createElement('pre')
    pre.innerHTML = _logo
    pre.style.position = 'fixed'
    pre.style.top = '0px'
    pre.style.left = '0px'
    pre.style.margin = '0px'
    pre.style.width = '100%'
    pre.style.height = '100%'
    pre.style.background = 'black'
    pre.style.color = '#fff'
    pre.style.zIndex = '999999'
    document.body.appendChild(pre)
  }, logo)
}
