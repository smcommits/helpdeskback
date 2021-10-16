import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from '../routes'


const app = express();
app.user(cors())

app.use('/user', routes.user)
 
app.listen(process.env.PORT, () =>
  console.log('Example app listening on port 3000!'),
);
 
