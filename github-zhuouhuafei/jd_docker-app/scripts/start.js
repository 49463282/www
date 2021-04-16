const fs = require('fs')
const { promisify } = require('util')
const shelljs = require('shelljs')
const prompts = require('prompts')

;(async () => {
  const filePath = './sys.config.js'
  const r = fs.existsSync(filePath)
  if (!r) {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: '请输入签名秘钥/Please enter the signature key',
      validate (value) {
        if (value.length < 6) {
          return `长度不少于6/Length not less than 6`
        } else {
          return true
        }
      }
    })
    const { value } = response
    fs.writeFileSync(filePath, `module.exports = {
  signSecretKey: '${value}'
}`, 'utf-8')
  }

  shelljs.cd('./service-api')
  shelljs.exec('npm i')
  shelljs.exec('npm start')
  shelljs.cd('../client-ui')
  shelljs.exec('npm i')
  shelljs.exec('npm run build')
  shelljs.cd('../jd_docker-config')
  shelljs.exec('npm i')
})()
