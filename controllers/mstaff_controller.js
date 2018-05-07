var bodyParser = require('body-parser');
var validator = require('./validators.js');
var User = require('./db_controller.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({extended: false});

var error = null;
var details = '0';
var hmodel = null, qty = null;

module.exports = function(app){

	// GET REQUEST HANDLERS

	app.get('/mstaff', ensureAuthenticatedMstaff, function(req, res){
		User.getAllEmployee(function(err, result){
			User.getCompleteDoctorDetails(function(err, result1){
				if(err) throw err;
				res.render('mstaff/dashboard.ejs', {list: result, list1: result1});
			});
		});
	});

	app.get('/mstaff/hardware', ensureAuthenticatedMstaff, function(req, res){
		User.getAllHardware(function(err, result){
			if(err) throw err;
			res.render('mstaff/hardware.ejs', {list: result, details: details, hmodel: hmodel, qty: qty});
			details = '0';
		});
	});

	app.get('/mstaff/settings', ensureAuthenticatedMstaff, function(req, res){
		User.getEmployeeDetails(req.session.passport.user, function(err, result){
			User.getState(result[0].city, function(err, result1){
				User.getAmail(req.session.passport.user, function(err, result2){
					User.getAcontact(req.session.passport.user, function(err, result3){
						var amail = null, acontact = null;
						if(result2.length > 0){
							amail = result2[0].email;
						}
						if(result3.length > 0){
							acontact = result3[0].contact;
						}
						res.render('mstaff/settings.ejs', {data: result[0], amail: amail, acontact: acontact, state: result1[0].state, error: error});
					});
				});
			});
		});
	});

	// POST REQUEST HANDLERS

	app.post('/mstaff/settings', urlencodedParser, function(req, resm){
		//console.log(req.body);
		req.checkBody('cnpass', '').equals(req.body.npass);
		var errors = req.validationErrors();
		if(errors){
			error = '1';
			resm.redirect('/mstaff/settings');
		}
		else{
			User.getUserById(req.session.passport.user, function(err, result){
				var p1 = result[0].password;
				var p2 = req.body.cpass;
				bcrypt.compare(p2, p1, function(err, res) {
    				if(res == true){
    					bcrypt.hash(req.body.npass, saltRounds, function(err, hash) {
  							User.changePassword(req.session.passport.user, hash);
							error = '2';
							resm.redirect('/mstaff/settings');
						});
    				}
    				else{
						error = '1';
						resm.redirect('/mstaff/settings');
					}
				});
				
			});
		}
	});

	app.post('/mstaff/hardware/details', urlencodedParser, function(req, res){
		User.getHardwareQuantity(req.body.model, function(err, result){
			if(result.length == 0){
				details = '-1';
				res.redirect('/mstaff/hardware');
			}
			else{
				hmodel = req.body.model;
				qty = result[0].quantity;
				details = '1';
				res.redirect('/mstaff/hardware');
			}
		});
	});

	app.post('/mstaff/hardware/save', urlencodedParser, function(req, res){
		if(req.body.quantity != '0'){
			User.updateHardware(hmodel, req.body.quantity);
		}
		else{
			User.deleteHardware(hmodel);
		}
		details = '2';
		res.redirect('/mstaff/hardware');
	});

	app.post('/mstaff/hardware/add', urlencodedParser, function(req, res){
		User.getHardwareQuantity(req.body.model, function(err, result){
			if(result.length != 0){
				details = '3';
				res.redirect('/mstaff/hardware');
			}
			else{
				User.insertHardware(req.body.model, req.body.type, req.body.quantity);
				details = '4';
				res.redirect('/mstaff/hardware');
			}
		});
	});

	function ensureAuthenticatedMstaff(req, res, next){
		if(req.isAuthenticated()){
			// AUTHENTICATED ==> continue
			User.getUserTypeById(req.session.passport.user, function(err, result){
				if(err) throw err;
				if(result[0].type == 'Maintenance'){
					return next();
				}
				res.redirect('/login');
			});
		}
		else{
			// NOT AUTHENTICATED ==> goto login page
			res.redirect('/login');
		}
	}

};