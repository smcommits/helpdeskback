require('dotenv').config();
const cors = require('cors');
const express = require('express')
const http = require('http');
const routes = require('./routes')
const socket = require('socket.io')
const Page = require('./models/page')


const app = express();
const server = http.createServer(app)
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const io = socket(server, {
  cors: {
    origin: 'https://localhost:3000'
  }
})


io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    socket.join(data);
  });
});


const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/authentication', routes.authentication)
app.use('/webhook', routes.webhook)
app.use('/page', routes.page)

server.listen(process.env.PORT, function() {
  server.on('request', function(request, response) {
    console.log(request.body)
    request.io = io
  })
});



