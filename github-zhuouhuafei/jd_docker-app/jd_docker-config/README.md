# 1功能介绍
* 使用jd_docker的默认配置
* 增加自动解析互助码功能

# 2安装环境
需要安装`nodejs`、`docker`、`docker-compose`

# 3克隆代码
`git clone https://gitee.com/zhouhuafei2/jd_docker-config.git`

# 4安装依赖
`npm i`

# 5文件改名
* 拷贝一份`1writeInCookieConfig.example.js`文件，并改名为`1writeInCookieConfig.js`
  - 需要在改名后的文件里填入指定格式的cookie，自行手动填入。
  - 问题注意：多账号换号登录h5时如果点了退出登录则账号会失效。
  - 解决方案：使用Chrome浏览器的无痕模式登录京东h5页面。
    - 如果换号登录，千万不要点击退出登录，因会导致账号cookie失效。
    - 只需要先关闭无痕模式，再重新打开无痕模式进行登录。

# 6启动脚本
`npm start`

# 7查看豆子
`npm test`
* 如果能查看表示脚本运行成功了
* 如果提示cookie失效则需要更换cookie并重新运行`npm start`

# 8终止脚本
`npm stop`

# 9后期维护
* 新增或减少了账号。
* 简单来说就是如果你修改了`1writeInCookieConfig.js`文件。
* 重新运行`npm start`即可。
