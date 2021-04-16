import request from '@/utils/request'

export default {
  async setting (data) {
    return await request({ url: '/setting', method: 'post', data })
  },

  async scriptStart (data) {
    return await request({ url: '/script/start', method: 'post', data })
  },

  async scriptStop (data) {
    return await request({ url: '/script/stop', method: 'post', data })
  },

  async count (data) {
    return await request({ url: '/user/count', method: 'get', data })
  },
  async register (data) {
    return await request({ url: '/user/register', method: 'post', data })
  },
  async login (data) {
    return await request({ url: '/user/login', method: 'post', data })
  },
  async captcha (data) {
    return await request({ url: '/user/captcha', method: 'get', data })
  }
}
