const {Product} = require('../models')
const productValidator = require('../validators/product')
const {Op} = require("sequelize");

const create = async (req, res) => {
    try {
        const {error} = productValidator.createProduct(req.body)

        const user = req.user

        if (error) {
            return res.status(400).json(error)
        }

        const product = await Product.create({...req.body, userId: user.id})
        res.json({message: 'Product is successfully added', product})
    } catch (err) {
        return res.status(500).json({message: 'Something went wrong'})
    }
}

const find = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id)
        if (!product) {
            res.status(400).json({message: 'Product is not exist'})
        }

        res.json(product);
    } catch {
        res.json({message: "Something went wronge"});
    }
}

const list = async (req, res) => {

    try {
        const {page = 1, rowPerPage = 10, ...search} = req.query
        const limit = Number(rowPerPage)
        const offset = (Number(page) - 1) * limit
        const where = {}
        for (const [field, value] of Object.entries(search)) {
            switch (field) {
                case 'name':
                    where[field] = {[Op.iLike]: `%${value}%`}
                    break
                case 'priceMin':
                    where.price = where.price || {}
                    where['price'][Op.gte] = Number(value)

                    break;
                case 'priceMax':
                    where.price = where.price || {}
                    where['price'][Op.lte] = Number(value)
                    break
                default:
                    where[field] = value
                    break;
            }
        }
        const products = await Product.findAndCountAll({
            where,
            offset,
            limit,
            orderBy:[['createdAt'],["ASC"]]
        })

        res.status(200).json(products);
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Something went wrong"})
    }
}

const update = async (req, res) => {
    try {
        const {id} = req.params;

        if (!Object.keys(req.body).length) {
            return res.status(400).json({message: "Data is rqeuired"})
        }

        const {error} = productValidator.updateProduct(req.body)

        if (error) {
            return res.status(400).json({error})
        }

        const isProductExist = await Product.findByPk(id)

        if (!isProductExist) {
            return res.status(400).json({message: 'Product is not exist'})
        }

        await Product.update(req.body, {where: {id}})

        const product = await Product.findByPk(id)

        return res.json(product);
    } catch (err) {
        res.status(500).json({message: "Something went wrong"})
    }
}

const remove = async (req, res) => {
    try {
        const {id} = req.params;

        const isProductExist = await Product.findByPk(id)
        if (!isProductExist) {
            return res.status(400).json({message: 'Product is not exist'})
        }
        console.log(isProductExist);
        await Product.destroy({where: {id}})

        const product = await Product.findByPk(id)

        if (!product) {
            return res.json({message: 'Product is deleted'});
        }
    } catch (err) {
        res.status(500).json({message: "Something went wrong"})
    }
}

module.exports = {
    create,
    find,
    list,
    remove,
    update,
}