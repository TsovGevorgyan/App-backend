const logger = require('../logger/logger');

const checkUserRole = async (req, res, next) => {
  try {
    if (req.user.role === 'buyer') {
      return res.status(400).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    logger(err, 'User permission');
    res.status(500).json({ message: 'Something went wrong' });
  }
};
module.exports = checkUserRole;
