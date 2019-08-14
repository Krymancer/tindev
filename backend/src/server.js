const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const router = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    console.log('New Connection: ', socket.id);

    const { developer } = socket.handshake.query;

    connectedUsers[developer] = socket.id;

});

const dbConnectionString = process.env.DB_STRING
.replace('USER',process.env.DB_USER)
.replace('PASSWORD',process.env.DB_PASS);

mongoose.connect(dbConnectionString, {
    useNewUrlParser: true
});

app.use((request, response, next) => {
    request.io = io;
    request.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(router);

server.listen(process.env.PORT);

