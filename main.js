var express = require('express');
var session = require('express-session');
var path = require('path');
var login = require('./controllers/login_controller');
var manager = require('./controllers/manager_controller');
var mstaff = require('./controllers/mstaff_controller');
var rec = require('./controllers/rec_controller');
var nurse = require('./controllers/nurse_controller.js');
var doctor = require('./controllers/doc_controller.js');
var app = express();
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var User = require('./controllers/db_controller.js');
var landing = require('./controllers/landing_controller.js');


// set up template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//static files

app.use(express.static('./public')); 

// Parser

app.use(cookieParser());

// Express Session

app.use(session({
	secret: 'keyboard cat',
	key: 'user', 
	cookie: { maxAge: 3600000, secure: false },
	saveUninitialized: true,
	resave: true
}));

// Passport Init

app.use(passport.initialize());
app.use(passport.session());

// Express Validation

app.use(expressValidator());
  

// Connect Flash

app.use(flash());

// fire controllers

landing(app);
login(app);
manager(app);
mstaff(app);
rec(app);
nurse(app);
doctor(app);
User(app);

function ensureAuthenticated(req, res, next){
		if(req.isAuthenticated()){
			// AUTHENTICATED ==> continue
			User.getUserTypeById(req.session.passport.user, function(err, result){
				if(err) throw err;
				
					return next();
				
				
			});
		}
		else{
			// NOT AUTHENTICATED ==> goto login page
			res.redirect('/login');
		}
	}


app.listen(3000);
