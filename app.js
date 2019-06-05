const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./config/db');
const boom = require('@hapi/boom');
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const userRoutes = require('./routes/user-routes');
const taskRoutes = require('./routes/task-routes');

const app = express();


const port = process.env.PORT || 5000;

/*DB connection*/
mongoose.connect(db, {useCreateIndex:true, useNewUrlParser:true})
.then(() => console.log('Database running'))
.catch((err) => console.log(err));

/*views middleware*/
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

/*middleware*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}));
app.use(flash());


/*set local variables used to display
  flash messages*/

  app.use((req, res, next) =>{
    res.locals.success = req.flash('sign-in');
    res.locals.success_up = req.flash('sign-up');
    res.locals.fail = req.flash('fail');
    res.locals.fail_msg = req.flash('fail_msg');
    res.locals.error = req.flash('error');
    next();

});






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