require('dotenv').config();
const cors = require('cors');
const express = require('express')
const routes = require('./routes')


const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://falkan:WeDhR1a4IPyZ8nYL@cluster0.mx77g.mongodb.net/helpdesk?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const app = express();
app.use(express.json())
app.use(cors())


app.use('/authentication', routes.authentication)
app.use('/webhook', routes.webhook)

app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}!`)
});
