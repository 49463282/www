const Controller = require('egg').Controller

class MyController extends Controller {
  async setting () {
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.user.setting(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async scriptStart () {
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.user.scriptStart(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async scriptStop () {
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.user.scriptStop(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async count () {
    const { ctx, service } = this
    const { request: { query } } = ctx
    const result = await service.user.count(query)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async register () {
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.user.register(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async login () {
    const { ctx, service } = this
    const { request: { body } } = ctx
    const result = await service.user.login(body)
    ctx.status = result.status || 200
    ctx.body = result
  }

  async captcha () {
    const { ctx, service } = this
    const { request: { query } } = ctx
    const result = await service.user.captcha(query)
    ctx.status = result.status || 200
    ctx.body = result
  }
}

module.exports = MyController
