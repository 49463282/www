const { signSecretKey } = require('../../../sys.config')
import md5 from 'md5'

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

export default createSign
