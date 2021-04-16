const { signSecretKey } = require('../../../sys.config')
const md5 = require('md5')

function createSign (data) {
  let sign = ''
  Object.keys(data).sort().forEach(key => {
    if (key === 'sign') return
    let val = data[key]
    try {
      val = JSON.stringify(val)
    } catch (e) {
      val = String(val)
    }
    sign += val
  })
  sign += signSecretKey
  sign = sign.replace(/"/g, '')
  return md5(sign)
}

module.exports = (ctx, next) => {
  const { request, response } = ctx
  const data = request.method === 'GET' ? request.query : request.body
  let { sign, ...ext } = data

  let signSuccess = true
  if (!data.timeStamp) {
    signSuccess = false
  }
  if (Date.now() - data.timeStamp > 120000) {
    signSuccess = false
  }
  if (sign !== createSign(ext)) {
    signSuccess = false
  }
  if (!signSuccess) {
    response.status = 400
    response.body = { message: '签名失败' }
    return
  }

  return next()
}
