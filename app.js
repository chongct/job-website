const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const session = require('express-session');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const port = process.env.PORT || 3000;

const routes = require('./routes/routes');
const dbConfig = require('./config/dbConfig');
console.log(dbConfig);

// configuration
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.urllive, { useMongoClient : true })
.then(()=>{ console.log("----Mongoose ok----")}, (err)=> { console.log(err) });

app.use(cookieParser()); // read cookies (needed for authentication)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); // set static path to public
app.engine('handlebars', exphbs({ defaultLayout: 'main'})); // look for main inside layouts according to documentation
// app.set('views', (path.join(__dirname, 'views'))); // because using express-handlebars
app.set('view engine', 'handlebars');

// session secret, session must be before flash and express validator
app.use(session({
  secret: 'iamproudtobeinWDI13', // secret key, unique encryption
  resave: false,
  saveUninitialized: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash messages for express
app.use(flash()); // use connect-flash for flash messages stored in session
// flash message, before every route, attach the flash messages and current user to res.locals
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next(); // going on to the next part of code
});

// express validation
app.use(expressValidator({
  errorFormatter : (param, msg, value) => {
      let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root

        while(namespace.length){
          formParam += '['+ namespace.shift()+ ']'
        }

        return {
          param : formParam,
          msg : msg,
          value : value
        };
    }
}));

// routes
app.use('/', routes);

app.listen(port, ()=>{
  console.log('----express connected----');
});
