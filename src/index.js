require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = socket(server, {
  cors: {
    origin: 'https://localhost:3000',
  },
});

io.sockets.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data);
  });
});

const mongoose = require('mongoose');
const routes = require('./routes');

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/authentication', routes.authentication);
app.use('/webhook', routes.webhook);
app.use('/page', routes.page);

server.listen(process.env.PORT, () => {
  server.on('request', (request, response) => {
    console.log(request.body);
    request.io = io;
  });
});
