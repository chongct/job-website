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
const server = require('http').createServer(app); // sockets runs on server not express
const io = require('socket.io')(server);
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

server.listen(port, ()=>{
  console.log('----express io connected----');
});

let users = [];
var numUsers = 0;

// socket.io connected
io.on('connection', (socket)=>{
  console.log('a user connected');

  // set username
  socket.on('set user', (data, callback)=>{
    if (users.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true); // run the function in check
      socket.username = data;
      users.push(socket.username);
      updateUsers();
    }
  });

  socket.on('typing', function(){
    io.sockets.emit('show typing', {user: socket.username});
    // console.log(socket.username);
  });

  // on click, event name, callback function
  // emit sends to user, executing the event
  socket.on('send message', function(data) {
    io.sockets.emit('show message', {msg: data, user: socket.username});
  });

  socket.on('disconnect', function(data) {
    if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsers();
  });

  function updateUsers() {
    io.sockets.emit('users', users);
  }
});

// // Chatroom
//
// let users = []
// var numUsers = 0;
// // // Socket.io connect
// io.on('connection', (socket) => {
// //   // Set Username
//   socket.on('set user', (data, callback) => {
//     // console.log('setting');
//     if(users.indexOf(data) != -1){
//       callback(false);
//     } else {
//       callback(true);
//       socket.username = data;
//       users.push(socket.username);
//       updateUsers();
//     }
//   });
// //
//   socket.on('send message', function(data){
//     io.sockets.emit('show message', {msg: data, user: socket.username});
//   });
// //
//   socket.on('typing', function() {
//       socket.emit('typing', { msg : "typing...",
//         user: socket.username
//       });
//     });
//
//     socket.on('stop typing', function () {
//        socket.emit('stop typing', { msg : "",
//          user: socket.username
//        });
//      });
//
// //
//   socket.on('disconnect', function(data){
//     if(!socket.username) return;
//     users.splice(users.indexOf(socket.username), 1);
//     updateUsers();
//   });
// //
//   function updateUsers(){
//     io.sockets.emit('users', users);
//   }
// //
// });
