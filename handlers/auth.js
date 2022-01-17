const {User} = require('../models')
const validator = require('../validators/auth')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken');
const {config: {jwtSecretKey}} = require('../config/config');

const register = async (req, res) => {
    try {
        const { error } = validator.validateRegister(req.body)
        if (error) {
            return res.status(400).json(error)
        }

        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
        const user = await User.create({...req.body, password})

        delete user.dataValues.password;
        return res.json(user.dataValues);
    }
    catch (err){
        console.log(err)
        return res.status(500).json({message: 'Something went wrong'})
    }
}

const login = async (req, res) => {
    try {
        const {error} = validator.validateLogin(req.body)

        if (error) {
            return res.status(400).json(error)
        }

        const {email, password} = req.body;
        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(400).json({message: 'Invalid Username or Password'})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({message: 'Invalid Username or Password'})
        }

        const token = jwt.sign({id: user.id}, jwtSecretKey);
        delete user.dataValues.password;
        return res.json({user: {...user.dataValues}, token, message: 'You are already logged in'})
    }
    catch (err){
        console.log(err);
        return res.status(500).json({Message: "Something went wrong"})
    }
}
const checkUser = async (req, res) => {
    try{
        const  { email } = req.params;
        const { error } = validator.validateEmail({email})
        if (error) {
            return res.status(400).json({message: 'Invalid Email'})
        }
        const isUserExist = await User.findOne({where: { email }})
        if (isUserExist) {
            return res.status(400).json({message: 'User Already Exist'})
        }
        else{
            return res.json({message: 'Valid Email'});
        }
    }catch(err) {
        console.log(err)
        return res.status(500).json({message: 'Something went wrong'})
    }
}

module.exports = {
    register, login, checkUser
}