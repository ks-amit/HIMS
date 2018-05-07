var nodemailer = require('nodemailer');
var User = require('./db_controller.js');
var mysql = require('mysql');
var randomToken = require('random-token');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports.validEmployee = function(req){
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('mail', 'Email is required').notEmpty();
	req.checkBody('mail', 'Email is not valid').isEmail();
	req.checkBody('salary', 'Salary cannot be empty').notEmpty();
	req.checkBody('salary', 'Salary is not valid').isInt();
	req.checkBody('addr', 'Address cannot be empty').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('state', 'State is required').notEmpty();
	req.checkBody('amail', 'Alternate Email is not valid').optional( { checkFalsy: true }).notEmpty();
	req.checkBody('contact', 'Contact is required').notEmpty();
	req.checkBody('contact', 'Contact is not valid').isInt().isLength({min: 10, max: 10});
	req.checkBody('acontact', 'Alternate Contact is not valid').optional( { checkFalsy: true }).isInt().isLength({min: 10, max: 10});
}

module.exports.validPatient = function(req){
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('address', 'Address cannot be empty').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('state', 'State is required').notEmpty();
	req.checkBody('contact', 'Contact is required').notEmpty();
	req.checkBody('contact', 'Contact is not valid').isInt().isLength({min: 10, max: 10});
}

module.exports.validEmergencyAdmit = function(req){
	req.checkBody('address', 'Address cannot be empty').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('state', 'State is required').notEmpty();
	req.checkBody('contact', 'Contact is required').notEmpty();
	req.checkBody('contact', 'Contact is not valid').isInt().isLength({min: 10, max: 10});
	req.checkBody('pid', 'Patient ID is not valid').isInt();
}

module.exports.calcMFeeGeneral = function(d2, m2, y2, d1, m1, y1){
	var cost = 0;
	cost += (y2 - y1) * (50000);
	cost += (m2 - m1) * (5000);
	cost += (d2 - d1) * (200);
	return cost;
}

module.exports.calcMFeePersonal = function(d2, m2, y2, d1, m1, y1){
	var cost = 0;
	cost += (y2 - y1) * (100000);
	cost += (m2 - m1) * (10000);
	cost += (d2 - d1) * (500);
	return cost;
}

module.exports.resetPassword = function(userid){
	User.getUserById(userid, function(err, result){
	User.fetchServer(function(err, result1){
		console.log(result);
		if(result.length > 0){

		
		

		var mailid1 = result1[0].email;
		var password = result1[0].pass;
		var mailid = '"Hospital Manager" <'+mailid1+'>';
		var proxy = result1[0].proxy;
		var serverproxy = "http://" + proxy;

		if(mailid1 != null && password != null){
			User.getEmployeeDetails(userid, function(err, result2){
				var TO = result2[0].email;
			

			

			if(err) throw err;
				if(result.length != 0){
					var pass= randomToken(8);
					var output = `
						<p>Dear User, </p>
						<p>Your are receiving this email because you had requested to reset your password.</p>
						<p>Your new password has been generated. Please login using the given new password.</p>
						<ul>
							<li>User ID: `+userid+`</li>
							<li>Password: `+pass+`</li>
						</ul>
						<p>Login Link: <a href="http://localhost:3000/login">LOGIN</a></p>
						<p>You may change your password after you login under the section - ACCOUNT SETTINGS</p>
						<p><strong>This is an automatically generated mail. Please do not reply back.</strong></p>
						
						<p>Regards,</p>
						<p>H Manager</p>
					`;
					var transporter = nodemailer.createTransport({
        				host: 'smtp.gmail.com', 
        				port: 587,       				
        				secure: false, // true for 465, false for other ports
        				proxy: serverproxy,
        				auth: {
            				user: mailid1, // generated ethereal user
            				pass: password // generated ethereal password
        				},
        				tls: {
        					rejectUnauthorized: false
        				}
    				});

    				// setup email data with unicode symbols
    				var mailOptions = {
        				from: mailid, // sender address
        				to: TO, // list of receivers
        				subject: 'Password Reset', // Subject line
        				text: 'Password has been reset', // plain text body
        				html: output // html body
    				};
    				// send mail with defined transport object
    				transporter.sendMail(mailOptions, (error, info) => {
        				if (error) {
            				return console.log(error);
        				}
        				console.log('Message sent: %s', info.messageId);
        				// Preview only available when sending through an Ethereal account
        				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
						bcrypt.hash(pass, saltRounds, function(err, hash) {
  							User.changePassword(userid, hash);
						});

        				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        				// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
   					});
				}

			});	

		}

			}	

	});		
	});
}

module.exports.sendCreatedMail = function(name, type, mail, userid, pass){
	User.fetchServer(function(err, result1){

		var mailid1 = result1[0].email;
		var password = result1[0].pass;
		var mailid = '"Hospital Manager" <'+mailid1+'>';
		var proxy = result1[0].proxy;
		var serverproxy = "http://" + proxy;

					var output = `
						<p>Hello `+name+`, </p>
						<p>Your are receiving this email because you have been newly appointed for the post of a `+type+` in the hospital.</p>
						<p>Your password has been generated. Please login using the given password.</p>
						<ul>
							<li>User ID: `+userid+`</li>
							<li>Password: `+pass+`</li>
						</ul>
						<p>Login Link: <a href="http://localhost:3000/login">LOGIN</a></p>
						<p>You may change your password after you login under the section - ACCOUNT SETTINGS</p>
						<p><strong>This is an automatically generated mail. Please do not reply back.</strong></p>
						
						<p>Regards,</p>
						<p>H Manager</p>

					`;
					var transporter = nodemailer.createTransport({
        				host: 'smtp.gmail.com', 
        				port: 587,       				
        				secure: false, // true for 465, false for other ports
        				proxy: serverproxy,
        				auth: {
            				user: mailid1, // generated ethereal user
            				pass: password // generated ethereal password
        				},
        				tls: {
        					rejectUnauthorized: false
        				}
    				});

    				// setup email data with unicode symbols
    				var mailOptions = {
        				from: mailid, // sender address
        				to: mail, // list of receivers
        				subject: 'Welcome to HManager', // Subject line
        				text: 'Welcome Mail', // plain text body
        				html: output // html body
    				};
    				// send mail with defined transport object
    				transporter.sendMail(mailOptions, (error, info) => {
        				if (error) {
            				return console.log(error);
        				}
        				console.log('Message sent: %s', info.messageId);
        				// Preview only available when sending through an Ethereal account
        				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        				// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
   					});

	});
}
			
	


/*
	req.checkBody('name', 'Name is required').notEmpty();
		req.checkBody('mail', 'Email is required').notEmpty();
		req.checkBody('mail', 'Email is not valid').isEmail();
		req.checkBody('salary', 'Salary cannot be empty').notEmpty();
		req.checkBody('salary', 'Salary is not valid').isInt();
		req.checkBody('addr', 'Address cannot be empty').notEmpty();
		req.checkBody('city', 'City is required').notEmpty();
		req.checkBody('state', 'State is required').notEmpty();
		req.checkBody('amail', 'Alternate Email is not valid').optional( { checkFalsy: true }).notEmpty();
		req.checkBody('contact', 'Contact is required').notEmpty();
		req.checkBody('contact', 'Contact is not valid').isInt().isLength({min: 10, max: 10});
		req.checkBody('acontact', 'Alternate Contact is not valid').optional( { checkFalsy: true }).isInt().isLength({min: 10, max: 10});
*/