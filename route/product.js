const {Router} = require("express")
const handlers = require('../handlers/product')
const authLev1 = require("../middlewares/auth");


//URL /api/product
const route = Router();


route.use(authLev1)

//GET
route.get('/', handlers.list)
route.get('/:id', handlers.find)

//POST
route.post('/', handlers.create)

//PUT
route.put('/:id', handlers.update)

//DELETE
route.delete('/:id', handlers.remove)


module.exports = route;

