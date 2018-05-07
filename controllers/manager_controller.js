var bodyParser = require('body-parser');
var validator = require('./validators.js');
var User = require('./db_controller.js');
var randomToken = require('random-token');
var bcrypt = require('bcrypt');
var url = require('url'); 
var bcrypt = require('bcrypt');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({extended: false});
var error = null;
var serror = '0';
var ferror = '0';
module.exports = function(app){

	// GET REQUEST HANDLERS

	app.get('/manager', ensureAuthenticatedManager, function(req, res){
		User.getAllEmployee(function(err, result){
			User.getCompleteDoctorDetails(function(err, result1){
				if(err) throw err;
				res.render('manager/dashboard.ejs', {list: result, list1: result1});
			});
		});
	});

	app.get('/manager/doctor', ensureAuthenticatedManager, function(req, res){
		res.render('manager/add_doctor.ejs', {error: null});
	});

	app.get('/manager/receptionist', ensureAuthenticatedManager, function(req, res){
		res.render('manager/add_rec.ejs', {error: null});
	});

	app.get('/manager/nurse', ensureAuthenticatedManager, function(req, res){
		res.render('manager/add_nurse.ejs', {error: null});
	});

	app.get('/manager/maintenance', ensureAuthenticatedManager, function(req, res){
		res.render('manager/add_mstaff.ejs', {error: null});
	});

	app.get('/manager/modify', ensureAuthenticatedManager, function(req, res){
		res.render('manager/modify.ejs', {error: null, ferror: ferror});
	});

	app.get('/manager/complaints', ensureAuthenticatedManager, function(req, res){
		User.getComplaints(function(err, result){
			if(err) throw err;
			res.render('manager/complaints.ejs', {list: result});
		});
	});

	app.get('/manager/complaints/show', ensureAuthenticatedManager, function(req, res){
		var q = url.parse(req.url, true);
		var date = q.query.year + "-" + q.query.month + "-" + q.query.date;
		User.getComplaintById(q.query.id, date, function(err, result){
			if(err) throw err;
			res.render('manager/p_complaint.ejs', {list: result});
		});
	});

	app.get('/manager/settings', ensureAuthenticatedManager, function(req, res){
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
						res.render('manager/settings.ejs', {data: result[0], amail: amail, acontact: acontact, state: result1[0].state, error: error});
					});
				});
			});
		});
	});

	app.get('/manager/stats', ensureAuthenticatedManager, function(req, res){
		
		var d = new Date();
		var y = d.getFullYear();
		var m = d.getMonth() + 1;
		var date = d.getDate();
		var today = y + "-" + m + "-" + date;
		var monthstart = y + "-" + m + "-01";

		User.patientsToday(today, function(err, result1){
			var ptoday = result1[0].ptoday;
			User.patientsThisMonth(monthstart, function(err, result2){
				var pmonth = result2[0].pmonth;
				User.GeneralOccupied(function(err, result3){
					var goc = result3[0].groom;
					User.PersonalOccupied(function(err, result4){
						var poc = result4[0].proom;
						User.totalIncome(function(err, result5){
							var income = result5[0].income;
							User.monthRevenue(monthstart, function(err, result6){
								var revenue = result6[0].m_fee + result6[0].c_fee + result6[0].d_fee;
								User.fetchServer(function(err, result7){
									res.render('manager/stats.ejs', {error: serror, ptoday: ptoday, pmonth: pmonth, goc: goc, poc: poc, income: income, revenue: revenue, server: result7[0]});
									serror = '0';
								});
							});
						});
					});
				});
			});
		});
	});

	// POST REQUEST HANDLERS

	app.post('/manager/stats', urlencodedParser, function(req, res){
		req.checkBody('email').optional( { checkFalsy: true }).isEmail();
		req.checkBody('pass').optional( { checkFalsy: true });
		var errors = req.validationErrors();
		if(errors){
			serror = '1';
			res.redirect('/manager/stats');
		}
		else{
			var mail = req.body.email;
			var pass = req.body.pass;
			var proxy = req.body.proxy;
			
			if(mail == '' && pass != ''){
				serror = '1';
				res.redirect('/manager/stats');
			}
			else if(pass == '' && mail != ''){
				serror = '1';
				res.redirect('/manager/stats');
			}
			else{
				if(mail == '' && pass == ''){
					User.deleteServer();
					serror = '2';
				}
				if(mail != '' && pass != ''){
					User.updateServer(mail, pass);
					serror = '2';
				}
				if(proxy == ''){
					User.deleteProxy();
					serror = '2';
					res.redirect('/manager/stats');
				}
				if(proxy != ''){
					User.changeProxy(proxy);
					serror = '2';
					res.redirect('/manager/stats');
				}
			}
		}
	});

	app.post('/manager/doctor', urlencodedParser, function(req, res){
		validator.validEmployee(req);
		req.checkBody('qual', 'Qualification is required').notEmpty();
		req.checkBody('exp', '').notEmpty().isInt();
		var errors = req.validationErrors();
		if(errors){
			res.render('manager/add_doctor.ejs', {error: '0'});
		}
		else{
			User.newUserId(function(err, result){
				if(err) throw err;
				var userid = 101;
				if(result.length > 0){
					userid = result[0].max + 1;
				}
				User.insertEmployee(userid, req.body.name, req.body.gender, req.body.salary, 'Doctor', req.body.contact, req.body.mail, req.body.addr, req.body.city);
				User.insertDoctor(userid, req.body.doctype, req.body.qual, req.body.exp);
				User.insertState(req.body.city, req.body.state);
				User.insertCurr(userid, req.body.doctype, 0);
				if(req.body.amail){
					User.insertAmail(userid, req.body.amail);
				}
				if(req.body.acontact){
					User.insertAcontact(userid, req.body.acontact);
				}
				res.render('manager/add_doctor.ejs', {error: '1'});
				var pass = randomToken(8);
				bcrypt.hash(pass, saltRounds, function(err, hash) {
  					User.insertLogin(userid, hash);
				});
				validator.sendCreatedMail(req.body.name, 'Doctor', req.body.mail, userid, pass);
				
			});
		}
	});

	app.post('/manager/receptionist', urlencodedParser, function(req, res){
		validator.validEmployee(req);
		var errors = req.validationErrors();
		if(errors){
			res.render('manager/add_rec.ejs', {error: '0'});
		}
		else{
			User.newUserId(function(err, result){
				if(err) throw err;
				var userid = result[0].max + 1;
				User.insertEmployee(userid, req.body.name, req.body.gender, req.body.salary, 'Receptionist', req.body.contact, req.body.mail, req.body.addr, req.body.city);
				User.insertState(req.body.city, req.body.state);
				if(req.body.amail){
					User.insertAmail(userid, req.body.amail);
				}
				if(req.body.acontact){
					User.insertAcontact(userid, req.body.acontact);
				}
				res.render('manager/add_rec.ejs', {error: '1'});
				var pass = randomToken(8);
				bcrypt.hash(pass, saltRounds, function(err, hash) {
  					User.insertLogin(userid, hash);
				});
				validator.sendCreatedMail(req.body.name, 'Receptionist', req.body.mail, userid, pass);
			});
		}
	});

	app.post('/manager/nurse', urlencodedParser, function(req, res){
		validator.validEmployee(req);
		req.checkBody('qual', 'Qualification is required').notEmpty();
		req.checkBody('exp', '').notEmpty().isInt();
		var errors = req.validationErrors();
		if(errors){
			res.render('manager/add_nurse.ejs', {error: '0'});
		}
		else{
			User.newUserId(function(err, result){
				if(err) throw err;
				var userid = result[0].max + 1;
				User.insertEmployee(userid, req.body.name, req.body.gender, req.body.salary, 'Nurse', req.body.contact, req.body.mail, req.body.addr, req.body.city);
				User.insertState(req.body.city, req.body.state);
				User.insertNurse(userid, req.body.qual, req.body.exp);
				if(req.body.amail){
					User.insertAmail(userid, req.body.amail);
				}
				if(req.body.acontact){
					User.insertAcontact(userid, req.body.acontact);
				}
				res.render('manager/add_nurse.ejs', {error: '1'});
				var pass = randomToken(8);
				bcrypt.hash(pass, saltRounds, function(err, hash) {
  					User.insertLogin(userid, hash);
				});
				validator.sendCreatedMail(req.body.name, 'Nurse', req.body.mail, userid, pass);
			});
		}
	});

	app.post('/manager/maintenance', urlencodedParser, function(req, res){
		validator.validEmployee(req);
		var errors = req.validationErrors();
		if(errors){
			res.render('manager/add_mstaff.ejs', {error: '0'});
		}
		else{
			User.newUserId(function(err, result){
				if(err) throw err;
				var userid = result[0].max + 1;
				User.insertEmployee(userid, req.body.name, req.body.gender, req.body.salary, 'Maintenance', req.body.contact, req.body.mail, req.body.addr, req.body.city);
				User.insertState(req.body.city, req.body.state);
				if(req.body.amail){
					User.insertAmail(userid, req.body.amail);
				}
				if(req.body.acontact){
					User.insertAcontact(userid, req.body.acontact);
				}
				res.render('manager/add_mstaff.ejs', {error: '1'});
				var pass = randomToken(8);
				bcrypt.hash(pass, saltRounds, function(err, hash) {
					console.log(hash);
  					User.insertLogin(userid, hash);
				});
				validator.sendCreatedMail(req.body.name, 'Maintenance Staff', req.body.mail, userid, pass);
			});
		}

	});

	app.post('/manager/settings', urlencodedParser, function(req, resm){
		//console.log(req.body);
		req.checkBody('cnpass', '').equals(req.body.npass);
		var errors = req.validationErrors();
		if(errors){
			error = '1';
			resm.redirect('/manager/settings');
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
							resm.redirect('/manager/settings');
						});
    				}
    				else{
						error = '1';
						resm.redirect('/manager/settings');
					}
				});
				
			});
		}
	});

	app.post('/manager/modify', urlencodedParser, function(req, res){
		req.checkBody('userid', 'User ID is required').isInt();
		req.checkBody('salary', 'Salary is not valid').optional( { checkFalsy: true }).isInt();
		req.checkBody('mail', 'Email is not valid').optional( { checkFalsy: true }).isEmail();
		req.checkBody('amail', 'Alternate Email is not valid').optional( { checkFalsy: true }).isEmail();
		req.checkBody('contact', 'Contact is not valid').optional( { checkFalsy: true }).isInt().isLength({min: 10, max: 10});
		req.checkBody('acontact', 'Alternate Contact is not valid').optional( { checkFalsy: true }).isInt().isLength({min: 10, max: 10});
		var errors = req.validationErrors();
		if(errors){
			res.render('manager/modify.ejs', {error: '0', ferror: '0'});
		}
		else{
			User.getEmployeeDetails(req.body.userid, function(err, result){
				if(result.length == 0){
					res.render('manager/modify.ejs', {error: '0', ferror: '0'});
				}
				else if(req.body.city == '' && req.body.state != ''){
					res.render('manager/modify.ejs', {error: '0', ferror: '0'});
				}
				else if(req.body.city != '' && req.body.state == ''){
					res.render('manager/modify.ejs', {error: '0', ferror: '0'});
				}
				else{
					if(req.body.salary != ''){
						User.updateEmployeeSalary(req.body.userid, req.body.salary);
					}
					if(req.body.mail != ''){
						User.updateEmployeeEmail(req.body.userid, req.body.mail);
					}
					if(req.body.amail != ''){
						User.insertAmail(req.body.userid, req.body.amail);
						User.updateEmployeeAemail(req.body.userid, req.body.amail);
					}
					if(req.body.contact != ''){
						User.updateEmployeeContact(req.body.userid, req.body.contact);
					}
					if(req.body.acontact != ''){
						User.insertAcontact(req.body.userid, req.body.acontact);
						User.updateEmployeeAContact(req.body.userid, req.body.acontact);
					}
					if(req.body.addr != ''){
						User.updateEmployeeAddress(req.body.userid, req.body.addr);
					}
					if(req.body.city != '' && req.body.state != ''){
						User.updateEmployeeCity(req.body.userid, req.body.city);
						User.insertState(req.body.city, req.body.state);
					}
					res.render('manager/modify.ejs', {error: '1', ferror: '0'});
				}
			});
		}
	});

	app.post('/manager/modify/fire', urlencodedParser, function(req, res){
		req.checkBody('userid', 'User ID not valid').isInt();
		User.getEmployeeDetails(req.body.userid, function(err, result){
			if(result.length == 0){
				ferror = '3';
				res.redirect('http://localhost:3000/manager/modify');
			}
			else{
				User.getEmployeeCount(result[0].type, function(err, result1){
				if(result1[0].count > 1){
					if(result[0].type == 'Manager'){
						ferror = '1';
						res.redirect('http://localhost:3000/manager/modify');
					}
					else if(result[0].type == 'Doctor'){
						User.getDoctorDetails(req.body.userid, function(err, result2){
							User.getTypeCount(result2[0].type, function(err, result3){
								if(result3[0].count > 1){
									User.deleteCurr(req.body.userid, function(err, result6){
										User.getDoctorsPatients(req.body.userid, function(err, result4){
											var len = result4.length;
											User.getDoctorIdPatients(result2[0].type, function(err, result5){
												User.updateCurr(result5[0].d_id, result5[0].patients + len);
												User.changeDoctor(req.body.userid, result5[0].d_id);
												User.changeDoctorRecord(req.body.userid, result5[0].d_id);
												User.deleteLogin(req.body.userid);
												User.deleteAcontact(req.body.userid);
												User.deleteAmail(req.body.userid);
												User.deleteDoctor(req.body.userid);
												User.deleteEmployee(req.body.userid);
												ferror = '2';
												res.redirect('http://localhost:3000/manager/modify');
											});
								
									});
									});
								}
								else{
									ferror = '1';
									res.redirect('http://localhost:3000/manager/modify');
								}
							});
						});
					}
					else if(result[0].type == 'Nurse'){
						User.deleteNurse(req.body.userid);
						User.deleteAcontact(req.body.userid);
						User.deleteAmail(req.body.userid);
						User.deleteLogin(req.body.userid);
						User.deleteEmployee(req.body.userid);
						ferror = '2';
						res.redirect('http://localhost:3000/manager/modify');
					}
					else{
						User.deleteAcontact(req.body.userid);
						User.deleteAmail(req.body.userid);
						User.deleteLogin(req.body.userid);
						User.deleteEmployee(req.body.userid);
						ferror = '2';
						res.redirect('http://localhost:3000/manager/modify');
					}
				}
				else{
					ferror = '1';
					res.redirect('http://localhost:3000/manager/modify');
				}
			});
			}
		});
	});

	// AUTHENTICATION 

	function ensureAuthenticatedManager(req, res, next){
		if(req.isAuthenticated()){
			// AUTHENTICATED ==> continue
			User.getUserTypeById(req.session.passport.user, function(err, result){
				if(err) throw err;
				if(result[0].type == 'Manager'){
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