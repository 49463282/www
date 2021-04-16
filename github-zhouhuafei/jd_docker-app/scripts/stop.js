const shelljs = require('shelljs')

shelljs.cd('./service-api')
shelljs.exec('npm stop')
