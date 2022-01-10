const jwt = require('jsonwebtoken');
const {config: {jwtSecretKey}} = require('../config/config');

const {User} = require('../models')

const authLev1 = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1]


        if (!token) {
            return res.status(401).json({message: "Token not found"})
        }
        const {id} = jwt.verify(token, jwtSecretKey)

        console.log('token ID', id);

        const user = await User.findByPk(id);


        if (!user) {
            return res.status(400).json({message: "User not found"})
        }

        req.user = user

        next()

    } catch (e) {
        return res.status(401).json({message: "Token not found"})
    }


}

module.exports = authLev1