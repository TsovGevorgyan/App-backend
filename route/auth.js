const {Router} = require("express")
const handlers = require('../handlers/auth')

const route = Router()


route.post('/register', handlers.register)
route.post('/login', handlers.login)
route.get('/user_check/:email', handlers.checkUser)


module.exports = route