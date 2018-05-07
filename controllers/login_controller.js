var express = require('express');
var nodemailer = require('nodemailer');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./db_controller.js');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var randomToken = require('random-token');
var validator = require('./validators.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){
	
	app.get('/login', function(req, res){
		//console.log('GET LOGIN');
		res.render('login.ejs', {error: null});
	});

	passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserById(username, function(err, user){
			if(!user.length){
				return done(null, false, {message: 'Invalid Credentials! Please try again.'});
			}
			else{
				bcrypt.compare(password, user[0].password, function(err, res){
					if(err) return done(err);
    				if(res == true){
    					User.getUserType(username, function(err, res1){
    						return done(null, res1[0]);
    					});
    				}
    				else{
    					return done(null, false, {message: 'Invalid Credentials! Please try again.'});
    				}
				});
			}
			
				
				
				
		});	
	}));

	passport.serializeUser(function(user, done){
		done(null, user.username);
	});
		
	passport.deserializeUser(function(username, done){
		User.getUserById(username, function(err, user){
			done(err, user);
		});
	});

	app.post('/login', urlencodedParser, function(req, res){
		passport.authenticate('local', function(err, user, info){
			console.log(user);
			if(err) throw err;
			if(!user){
				return res.render('login.ejs', {error: info});
			}
			else{
				req.login(user, function(err){
					if(err) throw err;
					if(user.type == 'Manager'){
						res.redirect('/manager');
					}
					else if(user.type == 'Maintenance'){
						res.redirect('/mstaff');
					}
					else if(user.type == 'Receptionist'){
						res.redirect('/receptionist');
					}
					else if(user.type == 'Nurse'){
						res.redirect('/nurse');
					}
					else if(user.type == 'Doctor'){
						res.redirect('/doctor');
					}
				});
			}
		})(req, res);
		
	});
		/* 
			var username = req.body.username;
		var password = req.body.password;
		User.checkUser(username, password, function(err, result){
			if(err) throw err;
			if(!result){
				res.render('login.ejs', {error: '1'});
			}
			else{
				var type = result.type;
				if(type == '1'){
					res.redirect('/manager');
				}
				else if(type == '2'){
					res.redirect('/receptionist');
				}
				else if(type == '3'){
					res.redirect('/doctor');
				}
				else if(type == '4'){
					res.redirect('/mstaff');
				}
			}
		});
		*/

	app.post('/reset', urlencodedParser, function(req, res){
		var userid = req.body.userid;
		validator.resetPassword(userid);
	});

	app.get('/logout', function(req, res){
  		req.logout();
  		res.redirect('/login');
	});

};