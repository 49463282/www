'use strict'

const sign = require('./sign')

const path = `/jd_docker-app/api`

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  const { router, controller } = app

  // hello world
  router.get(path + '/', controller.hello.get)

  // cookie
  router.post(path + '/cookie', sign, app.jwt, controller.cookie.post) // 增
  router.delete(path + '/cookie', sign, app.jwt, controller.cookie.delete) // 删
  router.put(path + '/cookie', sign, app.jwt, controller.cookie.put) // 改
  router.get(path + '/cookie', sign, app.jwt, controller.cookie.get) // 查
  router.post(path + '/cookie/import/excel', sign, app.jwt, controller.cookie.importExcel) // 批量导入数据

  // user
  router.get(path + '/user/count', sign, controller.user.count)
  router.post(path + '/user/register', sign, controller.user.register)
  router.post(path + '/user/login', sign, controller.user.login) // 登陆
  router.get(path + '/user/captcha', sign, controller.user.captcha) // 验证码

  // script
  router.post(path + '/script/start', sign, app.jwt, controller.user.scriptStart)
  router.post(path + '/script/stop', sign, app.jwt, controller.user.scriptStop)

  // setting
  router.post(path + '/setting', sign, app.jwt, controller.user.setting)

}
