var bodyParser = require('body-parser');
var validator = require('./validators.js');
var User = require('./db_controller.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({extended: false});

var error1 = '0';
var error = null;
var rpid = null;
var rdoa = null;
var rerror = null;

module.exports = function(app){

	// HANDLING GET REQUEST

	app.get('/nurse', ensureAuthenticatedNurse, function(req, res){
		User.getAllEmployee(function(err, result){
			User.getCompleteDoctorDetails(function(err, result1){
				if(err) throw err;
				res.render('nurse/dashboard.ejs', {list: result, list1: result1});
			});
		});
	});

	app.get('/nurse/settings', ensureAuthenticatedNurse, function(req, res){
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
						User.getNurseDetails(req.session.passport.user, function(err, result4){
							res.render('nurse/settings.ejs', {data: result[0], amail: amail, acontact: acontact, state: result1[0].state, error: error1, list1: result4});
							error1 = '0';
						});
					});
				});
			});
		});
	});

	app.get('/nurse/patients', ensureAuthenticatedNurse, function(req, res){
		User.getRecords(function(err, result){
			res.render('nurse/patients.ejs', {list: result, error: rerror});
			rerror = null;
		});
	});

	app.get('/nurse/p_report', ensureAuthenticatedNurse, function(req, res){
		User.getPatientById(rpid, rdoa, function(err, result){
			if(result[0].status == 'EMERGENCY'){
				User.getEmergencyRecord(rpid, rdoa, function(err, result1){
					res.render('nurse/p_report.ejs', {list: result1})
				});
			}
			else{
				User.getCompleteRecord(rpid, rdoa, function(err, result1){
					res.render('receptionist/p_report.ejs', {list: result1});
				});
			}
		});
	});

	// HANDLING POST REQUESTS

	app.post('/nurse/settings', urlencodedParser, function(req, resm){
		req.checkBody('cnpass', '').equals(req.body.npass);
		var errors = req.validationErrors();
		if(errors){
			error = '1';
			resm.redirect('/nurse/settings');
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
							resm.redirect('/nurse/settings');
						});
    				}
    				else{
						error = '1';
						resm.redirect('/nurse/settings');
					}
				});
				
			});
		}
	});

	app.post('/nurse/patients', urlencodedParser, function(req, res){
		rpid = req.body.pid;
		rdoa = req.body.date;
		User.getRecordById(rpid, rdoa, function(err, result){
			console.log(result);
			if(result.length > 0){
				res.redirect('/nurse/p_report');
			}
			else{
				rerror = 1;
				res.redirect('/nurse/patients');
			}
		});
	});

	function ensureAuthenticatedNurse(req, res, next){
		if(req.isAuthenticated()){
			// AUTHENTICATED ==> continue
			User.getUserTypeById(req.session.passport.user, function(err, result){
				if(err) throw err;
				if(result[0].type == 'Nurse'){
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

}