const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const logger = require('morgan');
require('dotenv').config();


const PORT = process.env.PORT;

const app = express();

app.use(logger('dev'));

app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const uri = process.env.MONGODB_URI

mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log('mongodb connected'))
    .catch(error => console.log('mongodb connection', error));

// routes
app.use(require('./routes/api.js'));

// linsing ports
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!!`);
})
