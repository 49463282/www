const shelljs = require('shelljs')
const path = require('path')

module.exports = ({ a, b }) => {
  console.log('workers/scriptStart', a, b)
  // shelljs.cd无效-需要在主线程执行才有效
  // shelljs.cd(path.resolve(__dirname, '../../../jd_docker-config'))
  shelljs.exec('pwd')
  shelljs.exec('npm start')
}
