const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const logger = require('morgan')

const PORT = precess.env.PORT || 3000;

const app = express();

 app.use(logger('dev'));

  app.use(compression());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

// const uri = process.env.MONGODB_URI

mongoose.connect(precess.env.MONGODB_URI || 'mongodb://localhost/budget',
   {
       useNewUrlParser: true,
       useFindAndModify: false 

});
 
// routes
app.use(require('./routes/api.js'));

app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}!!`);
})
