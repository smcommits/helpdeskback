require('dotenv').config();
const cors = require('cors');
const express = require('express')
const routes = require('./routes')


const { sequelize: db } = require('./models')

const app = express();
app.use(express.json())
app.use(cors())


app.use('/authentication', routes.authentication)
app.use('/webhook', routes.webhook)

db.sync().then(function () {
  app.listen(process.env.PORT, function() {
    console.log(`Example app listening on port ${process.env.PORT}!`)
  });
});
