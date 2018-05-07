var bodyParser = require('body-parser');
var validator = require('./validators.js');
var User = require('./db_controller.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({extended: false});

var error1 = '0';
var error = null;
var doc = null;
var p_id = null;
var rerror = null;
var edoc = null;
var eerror = null;
var epid = null;

var rpid = null;
var rdoa = null;

module.exports = function(app){

	// GET REQUEST HANDLERS

	app.get('/receptionist', ensureAuthenticatedRec, function(req, res){
		User.getAllEmployee(function(err, result){
			User.getCompleteDoctorDetails(function(err, result1){
				if(err) throw err;
				res.render('receptionist/dashboard.ejs', {list: result, list1: result1});
			});
		});
	});

	app.get('/receptionist/new', ensureAuthenticatedRec, function(req, res){
		User.getDoctorTypes(function(err, result){
			res.render('receptionist/newpatient.ejs', {list: result, error: error, doc: doc, pid: p_id});
			error = null;
			doc = null;
			p_id = null;
		});
	});

	app.get('/receptionist/emergency', ensureAuthenticatedRec, function(req, res){
		User.getEmergencyPatients(function(err, result){
			res.render('receptionist/emergency.ejs', {list: result, error: eerror, doc: edoc, pid: epid});
			eerror = null;
			edoc = null;
			epid = null;
		});
	});

	app.get('/receptionist/settings', ensureAuthenticatedRec, function(req, res){
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
						res.render('receptionist/settings.ejs', {data: result[0], amail: amail, acontact: acontact, state: result1[0].state, error: error1});
						error1 = '0';
					});
				});
			});
		});
	});

	app.get('/receptionist/p_report', ensureAuthenticatedRec, function(req, res){
		User.getPatientById(rpid, rdoa, function(err, result){
			if(result[0].status == 'EMERGENCY'){
				User.getEmergencyRecord(rpid, rdoa, function(err, result1){
					res.render('receptionist/p_report.ejs', {list: result1})
				});
			}
			else{
				User.getCompleteRecord(rpid, rdoa, function(err, result1){
					res.render('receptionist/p_report.ejs', {list: result1});
				});
			}
		});
	});

	app.get('/receptionist/bill', ensureAuthenticatedRec, function(req, res){
		User.getPatientById(rpid, rdoa, function(err, result){
			if(result[0].status == 'EMERGENCY'){
				User.getEmergencyRecord(rpid, rdoa, function(err, result1){
					res.render('receptionist/bill.ejs', {list: result1})
				});
			}
			else{
				User.getCompleteRecord(rpid, rdoa, function(err, result1){
					res.render('receptionist/bill.ejs', {list: result1});
				});
			}
		});
	});

	app.get('/receptionist/curr', ensureAuthenticatedRec, function(req, res){
		User.getCurrRecords(function(err, result){
			res.render('receptionist/curr.ejs', {list: result});
		});
	});

	app.get('/receptionist/reports', ensureAuthenticatedRec, function(req, res){
		User.getRecords(function(err, result){
			res.render('receptionist/report.ejs', {list: result, error: rerror});
			rerror = null;
		});
	});

	app.get('/receptionist/admit',ensureAuthenticatedRec, function(req, res){
		res.render('receptionist/admit.ejs', {error: '0', rid: null});
	});

	// POST REQUEST HANDLERS

	app.post('/receptionist/settings', urlencodedParser, function(req, resm){
		req.checkBody('cnpass', '').equals(req.body.npass);
		var errors = req.validationErrors();
		if(errors){
			error = '1';
			resm.redirect('/receptionist/settings');
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
							resm.redirect('/receptionist/settings');
						});
    				}
    				else{
						error = '1';
						resm.redirect('/receptionist/settings');
					}
				});
				
			});
		}
	});

	app.post('/receptionist/new', urlencodedParser, function(req, res){
		validator.validPatient(req);
		var errors = req.validationErrors();
		if(errors){
			error = '1';
		}
		else{
			var d = new Date();
			var y = d.getFullYear();
			var m = d.getMonth() + 1;
			var date = d.getDate();
			var today = y + "-" + m + "-" + date;
			User.newPatientId(today, function(err, result){
				if(err) throw err;
				var pid = '10001';
				if(result[0].id != null){
					pid = result[0].id + 1;
				}
				User.getDoctorIdPatients(req.body.dtype, function(err, result1){
					if(err) throw err;
					User.insertPatient(pid, req.body.name, req.body.sex, today, req.body.address, req.body.city, req.body.contact, result1[0].d_id);
					User.updateCurr(result1[0].d_id, result1[0].patients + 1);
					User.insertState(req.body.city, req.body.state);
					User.getEmployeeDetails(result1[0].d_id, function(err, result2){
						if(err) throw err;
						doc = result2[0].name;
					});
					User.createRecord(pid, result1[0].d_id, today);
					error = '2';
					p_id = pid;
					res.redirect('/receptionist/new');
				});

			});
		}
	});

	app.post('/receptionist/emergency', urlencodedParser, function(req, res){
		var d = new Date();
		var y = d.getFullYear();
		var m = d.getMonth() + 1;
		var date = d.getDate();
		var today = y + "-" + m + "-" + date;
		User.newPatientId(today, function(err, result){
			if(err) throw err;
			var pid = '10001';
			if(result[0].id != null){
				pid = result[0].id + 1;
			}
			User.getDoctorEmergency(function(err, result1){
				if(err) throw err;
				User.ePatient(pid, req.body.name, today, result1[0].d_id);
				User.updateCurr(result1[0].d_id, result1[0].patients + 1);
				User.getEmployeeDetails(result1[0].d_id, function(err, result2){
					if(err) throw err;
					edoc = result2[0].name;
				});
				User.createRecord(pid, result1[0].d_id, today);
				eerror = '2';
				epid = pid;
				var rid = '301';
				res.redirect('/receptionist/emergency');
			});
		});	
	});

	app.post('/receptionist/reports', urlencodedParser, function(req, res){
		rpid = req.body.pid;
		rdoa = req.body.date;
		User.getRecordById(rpid, rdoa, function(err, result){
			if(result.length > 0){
				if(req.body.button == 'REPORT'){
					res.redirect('/receptionist/p_report');
				}
				else if(req.body.button == 'BILL'){
					res.redirect('/receptionist/bill');
				}
				else if(req.body.button == 'DISCHARGE'){
					var d = new Date();
					var y = d.getFullYear();
					var m = d.getMonth() + 1;
					var date = d.getDate();
					var today = y + "-" + m + "-" + date;
					User.getCurrRecordById(rpid, rdoa, function(err, result1){
						if(result1.length > 0){

							User.dischargePatient(rpid, rdoa);
							User.addDOL(rpid, rdoa, today);
							User.getCurr(result1[0].d_id, function(err, result2){
								User.updateCurr(result1[0].d_id, result2[0].patients - 1);
							});
							if(result1[0].room > 100){
								User.getRoomDetails(result1[0].room, function(err, result3){
									User.updateRoom(result1[0].room, result3[0].patients - 1);
								});
							}
							rerror = 2;
							res.redirect('/receptionist/reports');
						}
						else{
							rerror = '30';
							res.redirect('/receptionist/reports');
						}
					});
				}
			}
			else{
				rerror = 1;
				res.redirect('/receptionist/reports');
			}
		});
	});

	app.post('/receptionist/admit', urlencodedParser, function(req, res){
		User.getRecordById(req.body.pid, req.body.date, function(err, result){
			if(err) throw err;
			if(result.length == 0){
				//console.log('ZERO');
				res.render('receptionist/admit.ejs', {error: '1', rid: null});
			}
			else{
				var rid;
				if(req.body.room == 'General'){
					User.getGeneralRoom(function(err, result1){
						if(result1.length > 0){
							
								rid = result1[0].id;
								User.assignRoom(req.body.pid, req.body.date, rid);
								User.updateRoom(rid, result1[0].patients + 1);
								res.render('receptionist/admit.ejs', {error: '3', rid: rid});
							
						}
						else{
							res.render('receptionist/admit.ejs', {error: '2', rid: null});
						}
					});
				}
				else if(req.body.room == 'Personal'){
					User.getPersonalRoom(function(err, result1){
						if(result1.length > 0){
							rid = result1[0].id;
							
								User.assignRoom(req.body.pid, req.body.date, rid);
								User.updateRoom(rid, 1);
								res.render('receptionist/admit.ejs', {error: '3', rid: rid});
							
						}
						else{
							res.render('receptionist/admit.ejs', {error: '2', rid: null});
						}
					});
				}
				
			}
		});
	});

	app.post('/receptionist/eadmit', urlencodedParser, function(req, res){
		//console.log(req.body);
		validator.validEmergencyAdmit(req);
		var errors = req.validationErrors();
		if(errors){
			eerror = '-1';
			res.redirect('/receptionist/emergency');
		}
		else{
			User.getPatientById(req.body.pid, req.body.doa, function(err, result){
				console.log(result);
				if(result.length == 0){
					eerror = '-1';	
					res.redirect('/receptionist/emergency');
				}
				else if(result[0].status != 'EMERGENCY'){
					eerror = '-1';
					res.redirect('/receptionist/emergency');
				}
				else{
					User.updateEmergencyPatient(req.body.pid, req.body.sex, req.body.doa, req.body.address, req.body.city, req.body.contact);
					if(req.body.room == 'General'){
						User.getGeneralRoom(function(err, result1){
							if(result1.length > 0){
								
									var rid = result1[0].id;
									User.assignRoom(req.body.pid, req.body.doa, rid);
									User.updateGeneralRoom(rid, result1[0].patients + 1);
									eerror = '5';
									res.redirect('/receptionist/emergency');
					
							}
							else{
								eerror = '6';
								res.redirect('/receptionist/emergency');
							}
						});
					}
					else if(req.body.room == 'Personal'){
						User.getPersonalRoom(function(err, result1){
							if(result1[0].length > 0){
								rid = result1[0].id;
								
									User.assignRoom(req.body.pid, req.body.doa, rid);
									User.updatePersonalRoom(rid, 1);
									eerror = '5'
									res.redirect('/receptionist/emergency');
								
							}
							else{
								eerror = '6';
								res.redirect('/receptionist/emergency');
							}
						});
					}	
				}
			});

			
			
		}
	});

	function ensureAuthenticatedRec(req, res, next){
		if(req.isAuthenticated()){
			// AUTHENTICATED ==> continue
			User.getUserTypeById(req.session.passport.user, function(err, result){
				if(err) throw err;
				if(result[0].type == 'Receptionist'){
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