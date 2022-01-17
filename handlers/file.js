const { File } = require('../models');
//const { Op } = require('sequelize');

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const isFileExist = await File.findByPk(id);

    if (!isFileExist) {
      res.status(400).json({ message: 'File is not exist' });
    }

    await File.destroy({
      where: {
        id: id,
      },
    });

    return res.json({ message: 'product image is deleted' });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Something went wrong' });
  }
};
module.exports = { remove };
