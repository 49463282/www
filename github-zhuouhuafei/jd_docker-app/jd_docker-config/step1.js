const shell = require('shelljs')
const fs = require('fs')
let jdCookie = require('./1writeInCookieConfig').cookie

jdCookie = jdCookie.filter(v => (v.trim && v.length))
jdCookie = jdCookie.map(v => v.split(' ').join(''))
if (!jdCookie.length) {
  return console.error('请填入cookie')
}

const fsContent = fs.readFileSync('./dockerComposeNoShareCodeNoCookie.yml', 'utf-8')
fs.writeFileSync('./docker-compose.yml', `${fsContent}\n    - JD_COOKIE=${jdCookie.join('&')}`, 'utf-8')

shell.exec(`docker-compose down`)
shell.exec(`docker-compose pull`)
shell.exec(`docker-compose up -d`)

// 重点1：只能是`-i` 不能是`-it` 因为包含`-t`会报错`the input device is not a TTY`。
// 重点2：linux的`>`和`>>`可以把`jd_get_share_code.js`运行时打印出的日志写入到一个文件里。前者覆盖文件内容，后者追加文件内容。
// 重点3：linux的`2>&1`中1表示正确信息输出通道，2表示错误信息输出通道。`2>&1`表示正确信息和错误信息都从1通道输出。`&>`与`2>&1`的效果一样，写法更简练而已。
shell.exec(`docker exec -i jd_scripts /bin/sh -c "node /scripts/jd_get_share_code.js"`) // 离谱-如果不加这行代码-第一个账号的crazyJoy会拿不到互助码
shell.exec(`docker exec -i jd_scripts /bin/sh -c "node /scripts/jd_get_share_code.js > /scripts/logs/jd_get_share_code.init.log 2>&1"`)
