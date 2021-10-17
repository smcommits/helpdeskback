require('dotenv').config();
const cors = require('cors');
const express = require('express')
const http = require('http');
const routes = require('./routes')
const ws = require('ws');


const app = express();
const server = http.createServer(app)
app.use(express.json())
app.use(cors())

const wss = new ws.Server({server: server})

wss.on('connection', function(socket, req) {
  console.log('Someone connected')
  socket.on('error', function(error) {
    console.log(error)
  })
})



wss.on('error', function(error) {
  console.log(error)
})


const broadcast = function(message) {
  wss.clients.forEach( function (client) {
    client.send(JSON.stringify(message))
  })
}

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/authentication', routes.authentication)
app.use('/webhook', routes.webhook)

server.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}!`)
});

exports.broadcast = broadcast;
