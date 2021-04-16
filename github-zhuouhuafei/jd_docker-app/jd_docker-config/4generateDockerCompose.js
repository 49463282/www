const fs = require('fs')
const users = require('./3autoWriteInShareCodeConfig')
const QYWX_KEY = require('./1writeInCookieConfig').QYWX_KEY

function fn () {
  const obj = {}
  users.forEach((item, index) => {
    item.JD_COOKIE = item.JD_COOKIE.split(' ').join('') // 移除中间空格
    Object.keys(item).forEach((key, keyIndex) => {
      if (obj[key] === undefined) {
        obj[key] = ''
      }
      let symbol = '&'
      if (key !== 'JD_COOKIE') {
        symbol = '@'
      }
      if (index === 0) {
        symbol = ''
      }
      if (key === 'JXNC_SHARECODES') { // 特殊处理-京喜农场-互助码与众不同
        // obj[key] += `${symbol}'${item[key]}'` // 但是在docker-compose里不需要特殊处理
        obj[key] += `${symbol}${item[key]}`
      } else {
        obj[key] += `${symbol}${item[key]}`
      }
    })
  })
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    if (key !== 'JD_COOKIE') {
      [...Array(users.length - 1)].forEach(() => {
        obj[key] += '&' + val
      })
    }
  })
  const fsContent = fs.readFileSync('./dockerComposeNoShareCodeNoCookie.yml', 'utf-8')
  let writeFileContent = `${fsContent}\n`
  writeFileContent += `    - QYWX_KEY=${QYWX_KEY}\n`
  Object.keys(obj).forEach(key => {
    writeFileContent += `    - ${key}=${obj[key]}\n`
  })
  fs.writeFileSync('./docker-compose.yml', writeFileContent, 'utf-8')
}

fn()
