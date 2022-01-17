const express = require('express')
const cors = require('cors');
const env = require('dotenv');


env.config()
const db = require('./models')
db.sequelize.sync();

const api = require("./api");
const app = express()

app.use(cors());

app.use(express.json())

app.use('/api', api)

app.use(express.static('public'))



const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on PORT : ${port}`));


