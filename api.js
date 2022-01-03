const auth = require('./route/auth')
const product = require('./route/product')
const api = require('express').Router()


api.use('/auth', auth)
api.use('/product', product)

module.exports = api