const { Router } = require('express');

const api = Router();

const auth = require('./route/auth');
const product = require('./route/product');
const file = require('./route/file');

api.use('/auth', auth);
api.use('/product', product);
api.use('/file', file);

module.exports = api;
