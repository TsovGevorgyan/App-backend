const { Product, File } = require('../models');
const productValidator = require('../validators/product');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const logger = require('../logger/logger');

const imagePath = path.join(__dirname, '../', 'public', 'files', 'images');
console.log('dirName', imagePath);
const create = async (req, res) => {
  try {
    throw new Error('error message');
    if (!Object.keys(req.body).length || !req.file) {
      return res.status(400).json({ message: 'Data is required' });
    }
    // throw new Error('my error')
    const { error } = productValidator.createProduct(req.body);

    const user = req.user;

    if (error) {
      return res.status(400).json(error);
    }
    let product = await Product.create({ ...req.body, userId: user.id });
    const { file } = req;
    if (file) {
      const fileSize = `${file.size}.kb`;
      const fileType = file.originalname.split('.').pop();
      const fileName = `${product.name}_${product.id}.${fileType}`;
      const path = `${imagePath}/${fileName}`;
      fs.writeFileSync(path, file.buffer);

      const item = {
        fileableType: 'product',
        fileableId: product.id,
        size: fileSize,
        name: fileName,
        src: `files/images/${fileName}`,
        userId: req.user.id,
      };

      console.log(item, 'item');

      await File.create(item);
    }
    product = await Product.findByPk(product.id, {
      include: [{ model: File }],
    });
    res.json({ message: 'Product is successfully added', product });
  } catch (err) {
    logger(err, 'ProductCreate');
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const find = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(400).json({ message: 'Product is not exist' });
    }

    res.json(product);
  } catch {
    res.json({ message: 'Something went wronge' });
  }
};

const list = async (req, res) => {
  try {
    const { page = 1, rowPerPage = 10, ...search } = req.query;
    const limit = Number(rowPerPage);
    const offset = (Number(page) - 1) * limit;
    const where = {};
    for (const [field, value] of Object.entries(search)) {
      switch (field) {
        case 'name':
          where[field] = { [Op.iLike]: `%${value}%` };
          break;
        case 'priceMin':
          where.price = where.price || {};
          where['price'][Op.gte] = Number(value);

          break;
        case 'priceMax':
          where.price = where.price || {};
          where['price'][Op.lte] = Number(value);
          break;
        default:
          where[field] = value;
          break;
      }
    }
    const products = await Product.findAndCountAll({
      where,
      offset,
      limit,
      orderBy: [['createdAt'], ['ASC']],
      include: [
        {
          model: File,
        },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log('request file-----', req.file)
    if (!Object.keys(req.body).length && !req.file) {
      return res.status(400).json({ message: 'Data is required' });
    } else if (Object.keys(req.body).length) {
      const { error } = productValidator.updateProduct(req.body);

      if (error) {
        return res.status(400).json({ error });
      }

      const isProductExist = await Product.findByPk(id);

      if (!isProductExist) {
        return res.status(400).json({ message: 'Product is not exist' });
      }

      await Product.update(req.body, { where: { id } });

      //return res.json(product);
    } else if (req.file) {
      //console.log('request file', req.file)
      const product = await Product.findByPk(id);

      const { file } = req;
      const fileSize = `${file.size}.kb`;
      const fileType = file.originalname.split('.').pop();
      const fileName = `${product.name}_${product.id}.${fileType}`;
      const path = `${imagePath}/${fileName}`;

      const item = {
        fileableType: 'product',
        fileableId: product.id,
        size: fileSize,
        name: `${fileName}`,
        src: `files/images/${fileName}`,
      };
      const isFileExist = await File.findOne({
        where: { fileableId: product.id, fileableType: 'product' },
      });
      if (!isFileExist) {
        console.log('file is not exist');
        await File.create(item);
      } else {
        console.log('file is exist');
        await File.update(item, { where: { id: isFileExist.id } });
        fs.unlinkSync(`${imagePath}/${isFileExist.name}`);
      }
      fs.writeFileSync(path, file.buffer);

      console.log('file.buffer', file.buffer);
      console.log('item', item);
    }
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: File }],
    });
    //console.log('Product results', product)
    res.json({ message: 'Product is successfully added', product });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const isProductExist = await Product.findByPk(id);
    if (!isProductExist) {
      return res.status(400).json({ message: 'Product is not exist' });
    }
    console.log(isProductExist);
    await Product.destroy({ where: { id } });

    const product = await Product.findByPk(id);

    if (!product) {
      return res.json({ message: 'Product is deleted' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  create,
  find,
  list,
  remove,
  update,
};
