'use strict'

/** @type Egg.EggPlugin */

// exports.static = {
//   enable: true
// }

exports.redis = {
  enable: true,
  package: 'egg-redis'
}

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose'
}

exports.cors = {
  enable: true,
  package: 'egg-cors'
}

exports.jwt = {
  enable: true,
  package: 'egg-jwt'
}
