const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const router = require('./routes');

const server = express();

const dbConnectionString = process.env.DB_STRING
.replace('USER',process.env.DB_USER)
.replace('PASSWORD',process.env.DB_PASS);

mongoose.connect(dbConnectionString);

server.use(express.json());
server.use(router);
server.listen(4000);

