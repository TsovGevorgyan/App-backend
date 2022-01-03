const Joi = require('joi')

const create= Joi.object({
    name : Joi.string().min(2).max(30).required(),
    description : Joi.string().min(20).max(200).required(),
    price : Joi.number().min(1).required(),
})

const update = Joi.object({
    name : Joi.string().min(2).max(30),
    description : Joi.string().min(20).max(200),
    price : Joi.number().min(1),
})

const createProduct = (data) => create.validate(data);
const updateProduct = (data) => update.validate(data);
module.exports = {
    createProduct, updateProduct
}