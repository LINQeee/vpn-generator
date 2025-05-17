import { execSync } from 'child_process'
import robot from 'robotjs'
import { sleep } from './utils.js'

let cords

export const activateVPN = async (login, code) => {
  execSync(`open -a "hidemy.name VPN"`)
  focusApp()
  robot.setMouseDelay(200)
  cords = getWindowCoordinates('hidemy.name VPN')
  if (!process.argv.includes('--not-logged')) {
    logout()
    robot.mouseClick()
  }
  await loginVPN(login, code)
  process.exit(0)
}

export const getWindowCoordinates = () => {
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

const focusApp = () => {
  const script = `tell application "hidemy.name VPN" to activate`
  execSync(`osascript -e '${script}'`)
}

const logout = () => {
  robot.moveMouseSmooth(cords.x + 30, cords.y + 60, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 30, cords.y + 120, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 30, cords.y + 550, 0.01)
  robot.mouseClick()
  robot.moveMouseSmooth(cords.x + 30, cords.y + 480, 0.01)
  robot.mouseClick()
}

const loginVPN = async (email, code) => {
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
