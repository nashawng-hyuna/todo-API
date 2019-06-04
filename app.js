const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./config/db');
const boom = require('@hapi/boom');

const userRoutes = require('./routes/user-routes');
const taskRoutes = require('./routes/task-routes');

const app = express();


const port = process.env.PORT || 5000;

/*DB connection*/
mongoose.connect(db, {useCreateIndex:true, useNewUrlParser:true})
.then(() => console.log('Database running'))
.catch((err) => console.log(err));

/*middleware*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//API routes
app.use('/api/task', taskRoutes);
app.use('/api/user', userRoutes);


//error middlware
app.use((error, req, res, next) =>{
    
    res.status(400).json({
       name: error.name,
       message: error.message,  
    });

    next();
})



app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});