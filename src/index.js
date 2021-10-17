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
  req.socket = io
  next()
}

app.use(attachSocket);

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};



app.use('/authentication', routes.authentication)
app.use('/webhook', routes.webhook)

server.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}!`)
});
