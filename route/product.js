const { Router } = require('express');
const handlers = require('../handlers/product');
const authLev1 = require('../middlewares/auth');
const checkUserRole = require('../middlewares/roleCheck');
const multer = require('multer');
const upload = multer();

//URL /api/product
const route = Router();

route.use(authLev1);
route.use(checkUserRole);
//GET
route.get('/', checkUserRole, handlers.list);
route.get('/:id', handlers.find);

//POST
route.post('/', upload.single('file'), handlers.create);

//PUT
route.put('/:id', upload.single('file'), handlers.update);

//DELETE
route.delete('/:id', handlers.remove);

module.exports = route;
