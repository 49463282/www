module.exports = {
  // 如果页面使用的是独立域名，此处可直接配置为/，如此，配置nginx时是不会出问题的。
  // 但是本项目的作者只有一个https的域名，所有项目都是使用二级路由区分的。
  // 如果这里配置为/，则配置nginx时，就无法区分每个项目的静态资源。
  // 还有一种解决方案就是此处配置为cdn服务器域名，例如配到七牛云的cdn上。
  // 打完包就把静态资源上传到七牛云上，因云存储都有bucket且静态资源都有md5，所以不用担心不同项目之间静态资源文件会互相覆盖。
  // 说到md5，那岂不是配置成/也没问题。
  // 虽然理论上行的通，但需要把所有项目的静态资源都打包到同一个目录。否则nginx将无法配置。
  // 但是打包到同一个目录，又不便于多团队开发。优化一下可以弄个静态资源服务器。
  // 说到静态资源服务器，那我首先想到的就是七牛云。
  // 所以使用七牛云存储的cdn是最优解，当然，其他云服务器的OSS存储自然也是可行的。
  // 本项目的实现方式是静态资源跟着项目走。
  // publicPath如果和vue-router的base保持一致，则nginx配置时需要把 ui界面路由 和 ui界面的静态资源路由 一起配置
  // publicPath如果和vue-router的base不保持一致，则nginx配置时需要把 ui界面路由 和 ui界面的静态资源路由 分开配置
  // 保持一致为 /jd_docker-app/ui/
  // 不保持一致为 /jd_docker-app/ui/static/
  // 两者各有利弊 可参考 https://github.com/zhouhuafei/docker-compose-config/blob/master/config/nginx/conf.d/include/conf/jd_docker-app.conf
  publicPath: '/jd_docker-app/ui/'
}
