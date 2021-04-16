const Service = require('egg').Service

class MyService extends Service {
  async importExcel (body) { // 批量导入数据
    const { ctx: { model } } = this
    const { list } = body
    list.forEach(async v => {
      v.priority = Number(v.priority) || 99
      await model.Cookie.findOneAndUpdate({ name: v.name }, v, { upsert: true, new: true, setDefaultsOnInsert: true })
    })
    return {}
  }

  async post (body) { // 增
    const { ctx } = this
    const { _id, ...main } = body
    main.priority = Number(main.priority) || 99
    const result = await ctx.model.Cookie.create(main)
    return { result }
  }

  $sleep (ms) {
    return new Promise((resolve) => {
      this.$sleepTimer = setTimeout(resolve, ms)
    })
  }

  async delete (body) { // 删
    // await this.$sleep(10000)
    const { ctx } = this
    const { _id, ...main } = body
    const result = await ctx.model.Cookie.findByIdAndDelete({ _id })
    return { result }
  }

  async put (body) { // 改
    const { ctx } = this
    const { _id, _v, createdAt, updatedAt, ...main } = body
    body.priority = Number(body.priority) || 99
    const result = await ctx.model.Cookie.findOneAndUpdate({ _id }, body)
    return { result }
  }

  async pagingFind (query) { // 分页查询
    query.limit = +query.limit
    let limit = query.limit || 10
    if (query.limit === 0) {
      limit = 0 // limit为0时-直接一页查出全部
    }
    const page = +query.page || 1
    const filter = { name: { $regex: new RegExp(query.name) } }
    const count = await this.ctx.model.Cookie.count(filter)
    const list = await this.ctx.model.Cookie.find(filter)
      .skip(limit * (page - 1)).limit(limit)
      .sort({ priority: 1, _id: 1 })
    // 排序案例一：
    // 先根据优先级排序，同样优先级再根据_id排序。
    // sort({ priority: 1, _id: 1 })
    // 排序案例二：
    // 先根据_id排序，根据_id排序一定能排出先后。
    // 则之后的排序规则起不到作用，所以priority无效。
    // sort({ _id: 1, priority: 1 })
    let pageCount
    if (limit === 0) {
      pageCount = 1 // 直接一页查出全部-特殊处理
    } else {
      // 如果limit为0则pageCount为Infinity
      // 但是在客户端pageCount展现出来的结果居然是null
      pageCount = Math.ceil(count / limit)
    }
    return {
      result: {
        list, // 数据集合
        page, // 当前是第几页
        limit: list.length, // 每页数据条数
        count, // 数据总条数
        pageCount // 总共多少页
      }
    }
  }

  async getOne (query) { // 查单个
    const result = await this.ctx.model.Cookie.findById({ _id: query._id })
    return { result }
  }
}

module.exports = MyService
