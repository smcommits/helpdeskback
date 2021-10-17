require('dotenv').config();
const cors = require('cors');
const express = require('express')
const http = require('http');
const routes = require('./routes')
const socketIO = require("socket.io");


const app = express();
const server = http.createServer(app)
app.use(express.json())
app.use(cors())


const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", 
  }
})

function attachSocket(req, res, next) {
  req.io = io
  console.log(req)
  next()
}

app.use(attachSocket);

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

io.on("connection", (socket) => {
  socket.join("room");
});


app.use('/authentication', routes.authentication)
app.use('/webhook', routes.webhook)

server.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}!`)
});
