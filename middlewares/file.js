const { File } = require('../models');

const verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productBelong = await File.findOne({
      where: { id: id, userId: req.user.id },
    });

    if (!productBelong) {
      res.status(500).json({ message: "Product is doesn't belong to User " });
    }
    next();
  } catch {
    res.status(500).json({ message: 'Something Went Wrong ' });
  }
};
module.exports = verifyUser;
