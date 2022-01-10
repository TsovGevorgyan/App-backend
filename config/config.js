const env = require('dotenv');


env.config()

const development = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "Auth",
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: true
}
const config = {
    jwtSecretKey: process.env.JWT_SECRET_KEY
}
module.exports = {
    development, config
};