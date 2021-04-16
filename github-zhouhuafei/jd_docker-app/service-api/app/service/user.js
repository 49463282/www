const Service = require('egg').Service
const captcha = require('trek-captcha')
const shelljs = require('shelljs')
const fs = require('fs')
const path = require('path')
const Piscina = require('piscina')

class MyService extends Service {
  async setting (body) {
    const { ctx: { model } } = this
    const { _id, ...main } = body
    const result = await model.Setting.findOneAndUpdate({}, main, {
      // 创建对象（如果不存在）。默认为false。
      upsert: true,
      // 如果为true，则返回修改后的文档，而不是原始文档。默认为false。
      new: true,
      // 如果upsert是true，则在创建新文档时，猫鼬将应用模型模式中指定的默认值。
      // 亲测：当setDefaultsOnInsert为true时，数据库存储的有对应默认列QYWX_KEY。
      // 亲测：当setDefaultsOnInsert为false时，数据库存储的无对应默认列QYWX_KEY。
      // 亲测：但是查询结果result是一致的，都有QYWX_KEY。
      setDefaultsOnInsert: true
    })
    return { message: '成功', result }
  }

  async scriptStart () {
    const { app, ctx, ctx: { model } } = this
    const { name } = ctx.state.user
    const startKeyName = `scriptStart${name}`
    const stopKeyName = `scriptStop${name}`
    if (await app.redis.get(startKeyName)) {
      return {
        status: 403,
        message: '脚本启动中请稍后再试...'
      }
    }
    if (await app.redis.get(stopKeyName)) {
      return {
        status: 403,
        message: '脚本停止中请稍后再试...'
      }
    }
    await app.redis.set(startKeyName, 1, 'EX', 1.5 * 60)
    const list = await model.Cookie.find()
      .sort({ priority: 1, _id: 1 })
    if (!list.length) {
      return {
        status: 403,
        message: '请新增账号'
      }
    }
    const res = await this.setting({})
    const resultSetting = res.result
    let strItem = `\n`
    let lastIndex = list.length - 1
    let symbol = ',\n'
    list.forEach((v, i) => {
      if (i === lastIndex) symbol = '\n'
      strItem += `  // ${v.name}
  'pt_key=${v.pt_key}; pt_pin=${v.pt_pin};'`
      strItem += symbol
    })
    const fileContent = `// 必填 - jd账号的cookie
module.exports.cookie = [${strItem}]
// 非必填 - 企业微信机器人推送
module.exports.QYWX_KEY = '${resultSetting.QYWX_KEY}'`
    fs.writeFileSync('../jd_docker-config/1writeInCookieConfig.js', fileContent, 'utf-8')
    // setTimeout治标不治本，只要内部逻辑触发。
    // 必然会长时间占用主线程，必然会阻塞其他接口。
    // 另开线程或者另开服务才是正解，此处是开了新的线程进行处理的。
    const piscina = new Piscina({ filename: path.resolve(__dirname, '../workers/scriptStart') })
    shelljs.cd(path.resolve(__dirname, '../../../jd_docker-config'))
    await piscina.runTask({ a: 1, b: 2 })
    await app.redis.del(startKeyName)
    return { message: '脚本启动成功' }
  }

  async scriptStop () {
    const { app, ctx } = this
    const { name } = ctx.state.user
    const startKeyName = `scriptStart${name}`
    const stopKeyName = `scriptStop${name}`
    if (await app.redis.get(startKeyName)) {
      return {
        status: 403,
        message: '脚本启动中请稍后再试...'
      }
    }
    if (await app.redis.get(stopKeyName)) {
      return {
        status: 403,
        message: '脚本停止中请稍后再试...'
      }
    }
    await app.redis.set(stopKeyName, 1, 'EX', 1.5 * 60)
    // setTimeout治标不治本，只要内部逻辑触发。
    // 必然会长时间占用主线程，必然会阻塞其他接口。
    // 另开线程或者另开服务才是正解，此处是开了新的线程进行处理的。
    const piscina = new Piscina({ filename: path.resolve(__dirname, '../workers/scriptStop') })
    shelljs.cd(path.resolve(__dirname, '../../../jd_docker-config'))
    await piscina.runTask({ a: 3, b: 4 })
    await app.redis.del(stopKeyName)
    return {
      message: '脚本停止成功',
      result: {}
    }
  }

  async count () {
    const { ctx } = this
    const count = await ctx.model.User.count()
    return {
      message: '成功',
      result: {
        count
      }
    }
  }

  async register (body) {
    const { ctx, app } = this
    const { captcha, uuid } = body
    if (captcha !== await app.redis.get(uuid)) {
      return {
        status: 403,
        message: '验证码错误'
      }
    }
    const res = await this.count()
    if (res.result.count > 0) {
      return {
        status: 403,
        message: '管理员账号已存在'
      }
    }

    await ctx.model.User.create(body)
    return {
      message: '注册成功',
      result: {}
    }
  }

  async login (body) {
    const { ctx, app } = this
    const { name, password, captcha, uuid } = body

    const findResult = await ctx.model.User.findOne({ name })

    if (!findResult) {
      // 直接抛错报500
      // return Promise.reject({ message: '账号不存在' })
      // 自定义状态码和错误
      return {
        status: 403,
        message: '账号不存在'
      }
    }

    if (password !== findResult.password) {
      return Promise.reject({ message: '密码错误' })
    }
    if (captcha !== await app.redis.get(uuid)) {
      return Promise.reject({ message: '验证码错误' })
    }

    const userInfo = {
      name: findResult.name,
      _id: findResult._id
    }
    const Authorization = app.jwt.sign(userInfo, app.config.jwt.secret)

    return {
      result: {
        Authorization,
        userInfo
      }
    }
  }

  async captcha (query) {
    const { app } = this
    const { uuid } = query
    const { token, buffer } = await captcha()
    await app.redis.set(uuid, token, 'EX', 2 * 60)
    const base64 = `data:image/gif;base64,${buffer.toString('base64')}`
    return {
      result: { base64 }
    }
  }
}

module.exports = MyService
