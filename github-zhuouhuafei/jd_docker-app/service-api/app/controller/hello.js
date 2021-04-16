const Controller = require('egg').Controller

class MyController extends Controller {
  async get () {
    const { ctx } = this
    ctx.body = { hello: 'world' }
  }
}

module.exports = MyController
