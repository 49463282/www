import request from '@/utils/request'

export default {
  async importExcel (data) {
    return await request({ url: '/cookie/import/excel', method: 'post', data })
  },
  async getList (data) {
    return await request({ url: '/cookie', method: 'get', data })
  },
  async getDetail (data) {
    return await request({ url: '/cookie', method: 'get', data })
  },
  async save (data) {
    let method = 'post'
    if (data._id) method = 'put'
    return await request({ url: '/cookie', method, data })
  },
  async delete (data) {
    return await request({ url: '/cookie', method: 'delete', data })
  }
}
