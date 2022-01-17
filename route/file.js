const { Router } = require('express');
const handlers = require('../handlers/file');
const route = Router();
const authLev1 = require('../middlewares/auth');
const verifyUser = require('../middlewares/file');

route.use(authLev1);
route.use('/:id', verifyUser);

route.delete('/:id', handlers.remove);

module.exports = route;
