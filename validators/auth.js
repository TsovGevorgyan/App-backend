const Joi = require('joi')

const registerSchema = Joi.object({
    firstName : Joi.string().min(3).max(30).trim().required(),
    lastName : Joi.string().min(3).max(30).trim().required(),
    email : Joi.string().email().required(),
    password : Joi.string().required(),
    password_confirmation: Joi.any().valid(Joi.ref('password')).required(),
    role: Joi.string().valid('buyer', 'seller').required(),
})

const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required(),
})

const emailSchema = Joi.object({
    email : Joi.string().email().required()
})
const validateRegister = (data) => registerSchema.validate(data)
const validateLogin = (data) => loginSchema.validate(data)
const validateEmail = (data) => emailSchema.validate(data)

module.exports = {
    validateRegister, validateLogin, validateEmail
}