var bodyParser = require('body-parser');
var validator = require('./validators.js');
var User = require('./db_controller.js');

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){


	app.get('/home', function(req, res){
		res.render('landing/home.ejs');
	});

	app.get('/complain', function(req, res){
		res.render('landing/complain.ejs', {error: null});
	});

	app.post('/complain', urlencodedParser, function(req, res){
		var d = new Date();
		var y = d.getFullYear();
		var m = d.getMonth() + 1;
		var date = d.getDate();
		var today = y + "-" + m + "-" + date;
		var id = '100';
		User.getComplaintId(today, function(err, result){
			console.log(result);
			if(result[0].id != null){
				id = result[0].id + 1;
			};
			User.fileComplaint(id, today, req.body.name, req.body.type, req.body.desc, function(err, result1){
				if(err) throw err;
				res.render('landing/complain.ejs', {error: '1'});
			});

		});	

	});

}