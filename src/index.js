import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes'

const { sequelize: db } = require('./models')

const app = express();
app.use(express.json())
app.use(cors())


app.use('/authentication', routes.authentication)
app.use('/webhook', routes.webhook)

db.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)
  });
});
