import axios from 'axios'
import createSign from '@/utils/sign'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import router from '@/router'

function request (options = {}) {
  options.data = options.data || options.params || {}
  options.data.timeStamp = Date.now()
  options.data.sign = createSign(options.data)
  if (options.method.toUpperCase() === 'GET') {
    options.params = options.data
  }
  return axios({
    ...options,
    headers: { Authorization: Cookies.get('Authorization') },
    params: options.params,
    data: options.data,
    url: window.API_URL + options.url
  }).then((res) => {
    return res.data.result
  }).catch((Error) => {
    console.error('打印Error：↓\n', Error)
    console.error('打印Error.message：↓\n', Error.message)
    console.error('打印Error.response：↓\n', Error.response)
    const { data = {}, status } = Error.response || {}
    if (status === 401) return router.replace({ name: 'Login' })
    Message({ message: data.message || Error.message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(data || Error)
  })
}

export default request
