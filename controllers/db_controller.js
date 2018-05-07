var bodyParser = require('body-parser');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({extended: false});

var con = mysql.createConnection({
	host: 'localhost',
	user: <username>,
	password: <password>,
	database: <database_name>
});

con.connect(function(err){
	if(err) throw err;
});

// DEFAULT QUERIES TO BE EXECUTED AT SERVER START

module.exports = function(app){
	for(var i = 101; i <= 200; i++){
		module.exports.insertGeneralRoom(i);
	}
	for(var i = 201; i <= 300; i++){
		module.exports.insertPersonalRoom(i);
	}
	
	/*
	var pass = '', id = '';
	bcrypt.hash(pass, saltRounds, function(err, hash) {
  		module.exports.changePassword(id, hash);
	});
	*/
	var d = new Date();
	var y = d.getFullYear() - 1;
	var m = d.getMonth() + 1;
	var date = d.getDate();
	var today = y + "-" + m + "-" + date;
	module.exports.deleteRecord(today);
}

//------------------------------------------------------------------------------------------//

module.exports.deleteRecord = function(date, callback){
	var query = "DELETE FROM patient WHERE dol < '"+date+"';";
	con.query(query, callback);
}

module.exports.insertAmail = function(userid, mail, callback){
	var query = "INSERT IGNORE INTO employee_email VALUES(" + userid + ", '" + mail + "');";
	con.query(query, callback);
}

module.exports.insertAcontact = function(userid, contact, callback){
	var query = "INSERT IGNORE INTO employee_contact VALUES(" + userid + ", " + contact + ");";
	con.query(query, callback);
}

module.exports.updateEmployeeSalary = function(userid, salary, callback){
      var query = "UPDATE employee SET salary = "+salary+" WHERE id = "+userid+";";
      con.query(query, callback);
}

module.exports.updateEmployeeContact = function(userid, contact, callback){
      var query = "UPDATE employee SET contact = "+contact+" WHERE id = "+userid+";";
      con.query(query, callback);
}

module.exports.updateEmployeeEmail = function(userid, email, callback){
      var query = "UPDATE employee SET email = '"+email+"' WHERE id = "+userid+";";
      con.query(query, callback);
}

module.exports.updateEmployeeAddress = function(userid, address, callback){
      var query = "UPDATE employee SET address = '"+address+"' WHERE id = "+userid+";";
      con.query(query, callback);
}

module.exports.updateEmployeeCity = function(userid, city, callback){
      var query = "UPDATE employee SET city = '"+city+"' WHERE id = "+userid+";";
      con.query(query, callback);
}

module.exports.updateEmployeeAContact = function(userid, contact, callback){
      var query =  "UPDATE employee_contact SET contact = "+contact+" WHERE id = "+userid+";"
      con.query(query, callback);
}

module.exports.updateEmployeeAemail = function(userid, mail, callback){
      var query =  "UPDATE employee_email SET email = '"+mail+"' WHERE id = "+userid+";"
      con.query(query, callback);
}

module.exports.deleteAcontact = function(userid, callback){
	var query = "DELETE IGNORE FROM employee_contact WHERE id = "+userid+";";
	con.query(query, callback);
}

module.exports.deleteAmail = function(userid, callback){
	var query = "DELETE IGNORE FROM employee_email WHERE id = "+userid+";";
	con.query(query, callback);
}

module.exports.insertLogin = function(userid, pass, callback){
	var query = "INSERT INTO login VALUES("+userid+", '"+pass+"');"
	con.query(query, callback);
}

module.exports.deleteLogin = function(userid, callback){
	var query = "DELETE IGNORE FROM login WHERE username = "+userid+";";
	con.query(query, callback);
}

module.exports.getUserType = function(userid, callback){
  	var query = "SELECT login.username, employee.type FROM employee INNER JOIN login ON employee.id = login.username AND login.username = " + userid + " WHERE EXISTS (SELECT * FROM login WHERE username = " + userid + ");";
  	con.query(query, callback);	
}

module.exports.getUserTypeById = function(userid, callback){
  	var query = "SELECT type FROM employee WHERE id = " + userid + ";";
  	con.query(query, callback);
}

module.exports.getUserById = function(userid, callback){
  	var query = "SELECT * FROM login WHERE username = " + userid + ";";
  	con.query(query, callback);
}

module.exports.newUserId = function(callback){
	var query = "SELECT MAX(id) as 'max' FROM employee;";
	con.query(query, callback);
}

module.exports.insertEmployee = function(userid, name, sex, salary, type, contact, email, address, city, callback){
    var query = "INSERT INTO employee VALUES("+userid+", '"+name+"', '"+sex+"', "+salary+", '"+type+"', "+contact+", '"+email+"', '"+address+"', '"+city+"');";
    con.query(query, callback);
}

module.exports.insertDoctor = function(userid, qual, type, exp, callback){
    var query = "INSERT INTO doctor VALUES("+ userid + ",'" + type + "', '" + qual + "', " + exp + ");";
    con.query(query, callback);
}

// CITY_STATE TABLE

module.exports.insertState = function(city, state, callback){
	var query = "INSERT IGNORE INTO city_state VALUES('" + city + "', '" + state + "');";
	con.query(query, callback);
}

module.exports.insertNurse = function(userid, qual, exp, callback){
	var query = "INSERT INTO nurse VALUES("+ userid + ", '" + qual + "', " + exp + ");";
    con.query(query, callback);
}

module.exports.deleteNurse = function(userid, callback){
	var query = "DELETE FROM nurse WHERE id = "+userid+";";
	con.query(query, callback);
}

module.exports.getEmployeeDetails = function(userid, callback){
	var query = "SELECT * FROM employee WHERE id = " + userid +";";
	con.query(query, callback);
}

module.exports.getState = function(city, callback){
	var query = "SELECT state FROM city_state where city = '" + city + "';";
	con.query(query, callback);
}

module.exports.getAmail = function(userid, callback){
	var query = "SELECT email FROM employee_email where id = " + userid + ";";
	con.query(query, callback);
}

module.exports.getAcontact = function(userid, callback){
	var query = "SELECT contact FROM employee_contact where id = " + userid + ";";
	con.query(query, callback);
}

module.exports.changePassword = function(userid, pass, callback){
	var query = "UPDATE login SET password = '" + pass + "' WHERE username = " + userid + ";";
	con.query(query, callback);
}

module.exports.getAllEmployee = function(callback){
	var query = "SELECT * FROM employee;";
	con.query(query, callback);
}

module.exports.totalIncome = function(callback){
	var query = "SELECT SUM(salary) as 'income' FROM employee;";
	con.query(query, callback);
}

module.exports.getEmployeeCount = function(type, callback){
	var query = "SELECT COUNT(id) as 'count' FROM employee WHERE type = '"+type+"';";
	con.query(query, callback);
}

module.exports.deleteEmployee = function(userid, callback){
	var query = "DELETE FROM employee WHERE id = "+userid+";";
	con.query(query, callback);
}

// HARDWARE TABLE

module.exports.getAllHardware = function(callback){
	var query = "SELECT * FROM hardware;";
	con.query(query, callback);
}

module.exports.getHardwareQuantity = function(model, callback){
	var query = "SELECT quantity FROM hardware WHERE model = '" + model + "';";
	con.query(query, callback);
}

module.exports.insertHardware = function(model, type, quantity, callback){
	var query = "INSERT IGNORE INTO hardware VALUES('" + model + "', '" + type + "', " + quantity + ");";
	con.query(query, callback);
}

module.exports.updateHardware = function(model, quantity, callback){
	var query = "UPDATE hardware SET quantity = " + quantity + " WHERE model = '" + model + "';";
	con.query(query, callback);
}

module.exports.deleteHardware = function(model, callback){
	var query = "DELETE FROM hardware WHERE model = '" + model + "';";
	con.query(query, callback);
}

// DOCTOR TABLE

module.exports.getDoctorTypes = function(callback){
	var query = "SELECT type FROM doctor GROUP BY(type);";
	con.query(query, callback);
}

module.exports.getDoctorDetails = function(userid, callback){
	var query = "SELECT * FROM doctor WHERE id = "+userid+";";
	con.query(query, callback);
}

module.exports.getTypeCount = function(type, callback){
	var query = "SELECT COUNT(id) AS 'count' FROM doctor WHERE type = '"+type+"';";
	con.query(query, callback);
}

module.exports.deleteDoctor = function(userid, callback){
	var query = "DELETE FROM doctor WHERE id = "+userid+";";
	con.query(query, callback);
}

module.exports.getCompleteDoctorDetails = function(callback){
	var query = "SELECT * FROM employee INNER JOIN (SELECT id, type as 'dtype' FROM doctor) as D ON employee.id = D.id;";
	con.query(query, callback);
}

// PATIENT TABLE

module.exports.newPatientId = function(date, callback){
	var query = "SELECT MAX(id) as 'id' FROM patient WHERE doa = '" + date + "';";
	con.query(query, callback);
}

module.exports.insertPatient = function(userid, name, sex, doa, address, city, contact, did, callback){
	var query = "INSERT INTO patient VALUES("+userid+", '"+name+"', '"+sex+"', '"+doa+"', '"+address+"', '"+city+"', "+contact+", "+did+", 000, NULL, 'CURRENT');";
	con.query(query, callback);
}

module.exports.assignRoom = function(pid, doa, room, callback){
	var query = "UPDATE patient SET room = "+room+" WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.ePatient = function(pid, name, doa, did, callback){
	var query = "INSERT INTO patient VALUES("+pid+", '"+name+"', 'TO BE UPDATED', '"+doa+"', 'TO BE UPDATED', 'TO BE UPDATED', -1, "+did+", 000, NULL, 'EMERGENCY');";
	con.query(query, callback);
}

module.exports.getEmergencyPatients = function(callback){
	var query = "SELECT * FROM (SELECT * FROM patient WHERE patient.status = 'EMERGENCY') AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
	con.query(query, callback);
}

module.exports.updateEmergencyPatient = function(userid, sex, doa, address, city, contact, callback){
	var query = "UPDATE patient SET sex = '"+sex+"', address = '"+address+"', city = '"+city+"', contact = "+contact+", status = 'CURRENT' WHERE id = "+userid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.getPatientById = function(pid, doa, callback){
	var query = "SELECT * from patient WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.addDOL = function(pid, doa, date, callback){
	var query = "UPDATE patient SET dol = '"+date+"' WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.dischargePatient = function(pid, doa, callback){
	var query = "UPDATE patient SET status = 'DISCHARGED' WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.patientsToday = function(today, callback){
	var query = "SELECT COUNT(id) as 'ptoday' FROM patient WHERE doa = '"+today+"';";
	con.query(query, callback);
}

module.exports.patientsThisMonth = function(date, callback){
	var query = "SELECT COUNT(id) as 'pmonth' FROM patient WHERE doa >= '"+date+"';";
	con.query(query, callback);
}

module.exports.changeDoctor = function(pdid, ndid, callback){
	var query = "UPDATE patient SET d_id = "+ndid+" WHERE d_id = "+pdid+";";
	con.query(query, callback);
}

// CURR TABLE

module.exports.updateCurr = function(d_id, patients, callback){
	var query = "UPDATE curr SET patients = "+patients+" WHERE d_id = "+d_id+";";
	con.query(query, callback);
}

module.exports.insertCurr = function(d_id, type, patients, callback){
	var query = "INSERT INTO curr VALUES("+d_id+", '"+type+"', "+patients+");";
	con.query(query, callback);
}

module.exports.getDoctorIdPatients = function(type, callback){
	var query = "SELECT d_id, patients FROM curr WHERE patients = (SELECT MIN(patients) FROM curr WHERE type = '"+type+"') AND type = '"+type+"';";
	con.query(query, callback);
}

module.exports.getDoctorEmergency = function(callback){
	var query = "SELECT d_id, patients FROM curr WHERE patients = (SELECT MIN(patients) FROM curr WHERE type = 'Surgeon') AND type = 'Surgeon';";
	con.query(query, callback);
}

module.exports.deleteCurr = function(did, callback){
	var query = "DELETE FROM curr WHERE d_id = "+did+";";
	con.query(query, callback);
}

module.exports.getCurr = function(did, callback){
	var query = "SELECT * FROM curr WHERE d_id = "+did+";";
	con.query(query, callback);
}

// RECORD TABLE

module.exports.createRecord = function(userid, did, doa, callback){
	var query = "INSERT INTO record VALUES("+userid+", "+did+", '"+doa+"', 'TO BE UPDATED', 'TO BE UPDATED', 0, 0, 0);";
	con.query(query, callback);
}

module.exports.getRecords = function(callback){
	var query = "SELECT * FROM patient INNER JOIN record ON record.id = patient.id AND record.doa = patient.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = patient.d_id;";
	con.query(query, callback);
}

module.exports.getRecordById = function(pid, doa, callback){
	var query = "SELECT * FROM record WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.getCompleteRecord = function(pid, doa, callback){
	var query = "select * from (select * from patient where patient.id = "+pid+" AND patient.doa = '"+doa+"') AS A INNER JOIN (select * from record where record.id = "+pid+" AND record.doa = '"+doa+"') AS B ON A.id = B.id AND A.doa = B.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id INNER JOIN city_state ON A.city = city_state.city;";
	con.query(query, callback);
}

module.exports.getEmergencyRecord = function(pid, doa, callback){
	var query = "select * from (select * from patient where patient.id = "+pid+" AND patient.doa = '"+doa+"') AS A INNER JOIN (select * from record where record.id = "+pid+" AND record.doa = '"+doa+"') AS B ON A.id = B.id AND A.doa = B.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
	con.query(query, callback);
}

module.exports.getCurrRecords = function(callback){
	var query = "SELECT * FROM (SELECT * FROM patient WHERE patient.status = 'CURRENT' OR patient.status = 'EMERGENCY') AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
	con.query(query, callback);
}

module.exports.getCurrRecordById = function(pid, doa, callback){
	var query = "SELECT * FROM (SELECT * FROM patient WHERE patient.id = "+pid+" AND patient.doa = '"+doa+"' AND (patient.status = 'CURRENT' OR patient.status = 'EMERGENCY')) AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
	con.query(query, callback);
}

module.exports.updateRecord = function(pid, doa, desc, meddesc, dfee, callback){
	var query = "UPDATE record SET description = '"+desc+"', medicines = '"+meddesc+"', d_fee = "+dfee+" WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.monthRevenue = function(date, callback){
	var query = "SELECT SUM(m_fee) AS 'm_fee', SUM(c_fee) AS 'c_fee', SUM(d_fee) AS 'd_fee' FROM record where doa >= '"+date+"';";
	con.query(query, callback);
}

module.exports.getDoctorsPatients = function(did, callback){
	var query = "SELECT * FROM (SELECT * FROM patient WHERE (patient.status = 'CURRENT' OR patient.status = 'EMERGENCY') AND patient.d_id = "+did+") AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
	con.query(query, callback);
}

module.exports.changeDoctorRecord = function(pdid, ndid, callback){
	var query = "UPDATE record SET d_id = "+ndid+" WHERE d_id = "+pdid+";";
	con.query(query, callback);
}

module.exports.updateMFee = function(pid, doa, mfee, callback){
	var query = "UPDATE record SET m_fee = "+mfee+" WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

module.exports.updateCFee = function(pid, doa, cfee, callback){
	var query = "UPDATE record SET c_fee = "+cfee+" WHERE id = "+pid+" AND doa = '"+doa+"';";
	con.query(query, callback);
}

// ROOM TABLE

module.exports.getGeneralRoom = function(callback){
	var query = "SELECT * FROM room WHERE patients = (SELECT MAX(patients) FROM room WHERE type = 'General' AND patients < 3) AND type = 'General';";
	con.query(query, callback);
}

module.exports.getPersonalRoom = function(callback){
	var query = "SELECT * FROM room WHERE patients = (SELECT MAX(patients) FROM room WHERE type = 'Personal' AND patients < 1) AND type = 'Personal';";
	con.query(query, callback);
}

module.exports.getEmergencyRoom = function(callback){
	var query = "SELECT MAX(id) as 'id' FROM room WHERE type = 'Emergency';";
	con.query(query, callback);
}

module.exports.insertPersonalRoom = function(id, callback){
	var query = "INSERT INTO room VALUES("+id+", 'Personal', 0);";
	con.query(query, callback);
}

module.exports.updateGeneralRoom = function(id, patients, callback){
	var query = "UPDATE room SET patients = "+patients+" WHERE id = "+id+";";
	con.query(query, callback);
}

module.exports.updatePersonalRoom = function(id, patients, callback){
	var query = "UPDATE room SET patients = "+patients+" WHERE id = "+id+";";
	con.query(query, callback);
}

module.exports.insertGeneralRoom = function(id, callback){
	var query = "INSERT INTO room VALUES("+id+", 'General', 0);";
	con.query(query, callback);
}

module.exports.GeneralOccupied = function(callback){
	var query = "SELECT COUNT(id) AS 'groom' FROM room WHERE type = 'General' AND patients > 0;";
	con.query(query, callback);
}

module.exports.PersonalOccupied = function(callback){
	var query = "SELECT COUNT(id) AS 'proom' FROM room WHERE type = 'Personal' AND patients > 0;";
	con.query(query, callback);
}

module.exports.getRoomDetails = function(rid, callback){
	var query = "SELECT * FROM room WHERE id = "+rid+";";
	con.query(query, callback);
}

module.exports.updateRoom = function(rid, patients, callback){
	var query = "UPDATE room SET patients = "+patients+" WHERE id = "+rid+";";
	con.query(query, callback);
}

// NURSE TABLE

module.exports.getNurseDetails = function(id, callback){
	var query = "SELECT * FROM nurse WHERE id = "+id+";";
	con.query(query, callback);
}

// SERVER TABLE

module.exports.deleteServer = function(callback){
	var query = "UPDATE server SET email = NULL, pass = NULL;";
	con.query(query, callback);
}

module.exports.updateServer = function(email, pass, callback){
	var query = "UPDATE server SET email = '"+email+"', pass = '"+pass+"';";
	con.query(query, callback);
}

module.exports.changeProxy = function(proxy, callback){
	var query = "UPDATE server SET proxy = '"+proxy+"';";
	con.query(query, callback);
}

module.exports.deleteProxy = function(callback){
	var query = "UPDATE server SET proxy = NULL;";
	con.query(query, callback);
}

module.exports.fetchServer = function(callback){
	var query = "SELECT * FROM server;";
	con.query(query, callback);
}

// COMPLAIN TABLE

module.exports.fileComplaint = function(id, date, name, type, description, callback){
	var query = "INSERT INTO complain VALUES("+id+", '"+date+"', '"+name+"', '"+type+"', '"+description+"');";
	con.query(query, callback);
}

module.exports.getComplaintId = function(date, callback){
	var query = "SELECT MAX(id) as 'id' FROM complain WHERE dof = '"+date+"';";
	con.query(query, callback);
}

module.exports.getComplaints = function(callback){
	var query = "SELECT * FROM complain;";
	con.query(query, callback);
}

module.exports.getComplaintById = function(id, dof, callback){
	var query = "SELECT * FROM complain WHERE id = "+id+" AND dof = '"+dof+"';";
	con.query(query, callback);
}






