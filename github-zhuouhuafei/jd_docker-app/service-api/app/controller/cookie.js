const Controller = require('egg').Controller

class MyController extends Controller {
  async post () { // 增
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.cookie.post(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async delete () { // 删
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.cookie.delete(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async put () { // 改
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.cookie.put(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async get () { // 查
    const { ctx, service } = this
    const { request: { query } } = ctx
    let result
    if (query._id) {
      result = await service.cookie.getOne(query)
    } else {
      result = await service.cookie.pagingFind(query)
    }
    ctx.status = result.status || 200
    ctx.body = result
  }

  async importExcel () { // 批量导入数据
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.cookie.importExcel(body)
    ctx.status = result.status || 200
    ctx.body = result
  }
}

module.exports = MyController
