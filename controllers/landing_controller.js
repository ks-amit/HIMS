const bodyParser = require('body-parser');
const User = require('./db_controller.js');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {


	app.get('/home', function (req, res) {
		res.render('landing/home.ejs');
	});

	app.get('/complain', function (req, res) {
		res.render('landing/complain.ejs', { error: null });
	});

	app.post('/complain', urlencodedParser, function (req, res) {
		const d = new Date();
		const y = d.getFullYear();
		const m = d.getMonth() + 1;
		const date = d.getDate();
		const today = y + "-" + m + "-" + date;
		const id = '100';
		User.getComplaintId(today, function (err, result) {
			console.log(result);
			if (result[0].id != null) {
				id = result[0].id + 1;
			};
			User.fileComplaint(id, today, req.body.name, req.body.type, req.body.desc, function (err, result1) {
				if (err) throw err;
				res.render('landing/complain.ejs', { error: '1' });
			});

		});

	});

}