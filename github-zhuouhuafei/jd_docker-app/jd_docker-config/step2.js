const shell = require('shelljs')
const fs = require('fs')
let jdCookie = require('./1writeInCookieConfig').cookie

jdCookie = jdCookie.filter(v => (v.trim && v.length))
jdCookie = jdCookie.map(v => v.split(' ').join(''))
if (!jdCookie.length) {
  return console.error('请填入cookie')
}

let fsContent = fs.readFileSync('./logs/jd_get_share_code.init.log', 'utf-8')
let matchRe = fsContent.split('开始======').slice(1, jdCookie.length + 1)
matchRe = matchRe.map((v, i) => {
  const obj = { JD_COOKIE: jdCookie[i] }
  let re2 = /[\u4e00-\u9fa5\w]+】[^\u4e00-\u9fa5【]+/g
  v.match(re2).forEach((v2, i2, a2) => {
    v2 = v2.replace(/\s*/g, '') // 特殊处理-正则补漏-清理掉换行符
    if (i2 === a2.length - 1) { // 特殊处理-正则补漏-处理最后一个互助码
      v2 = v2.replace('======', '')
    }
    let arr = v2.split('】')
    arr[0] = arr[0].replace('京东农场', 'FRUITSHARECODES')
    arr[0] = arr[0].replace('京东萌宠', 'PETSHARECODES')
    arr[0] = arr[0].replace('种豆得豆', 'PLANT_BEAN_SHARECODES')
    arr[0] = arr[0].replace('东东工厂', 'DDFACTORY_SHARECODES')
    arr[0] = arr[0].replace('京喜工厂', 'DREAM_FACTORY_SHARE_CODES')
    arr[0] = arr[0].replace('京喜农场', 'JXNC_SHARECODES')
    arr[0] = arr[0].replace('的京东赚赚好友互助码', 'JDZZ_SHARECODES')
    arr[0] = arr[0].replace('crazyJoy', 'JDJOY_SHARECODES')
    arr[0] = arr[0].replace('闪购盲盒', 'JDSGMH_SHARECODES')
    arr[0] = arr[0].replace('财富岛', 'JDCFD_SHARECODES')
    arr[0] = arr[0].replace('签到领现金', 'JD_CASH_SHARECODES')
    obj[arr[0]] = arr[1]
  })
  return obj
})
const writeFileContent = `module.exports = ${JSON.stringify(matchRe, null, 2)}`
fs.writeFileSync('./3autoWriteInShareCodeConfig.js', writeFileContent, 'utf-8')
shell.exec(`node ./4generateDockerCompose.js`)
// shell.exec(`docker-compose restart`) // 注意：因重启不会重新创建容器，固不会更新docker容器的环境变量env。会导致process.env.FRUITSHARECODES拿不到值。
shell.exec(`docker-compose down`)
shell.exec(`docker-compose up -d`)
