'use strict'
const path = require('path')
const thisFileName = path.parse(__filename).name

const definition = {
  QYWX_KEY: {
    type: String,
    default: '',
    trim: true,
    unique: true
  }
}
const options = {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  collection: thisFileName
}
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const PostSchema = new Schema(definition, options)
  return mongoose.model(thisFileName, PostSchema)
}
