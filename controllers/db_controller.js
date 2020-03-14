const mysql = require('mysql');
const bcrypt = require('bcrypt');

// CONFIGURATION - TO BE DONE BY THE USER BEFORE INSTALLING THE APP

const con = mysql.createConnection({
	host: 'localhost',
	user: <username>,
	password: <password>,
	database: <database_name>
});
				
con.connect(function(err){
	if(err) throw err;
});

// DO NOT REMOVE THE SINGLE QUOTES
const emailServerDetails = {
	emailId: '<YOUR EMAIL ID HERE>',
	pass: '<YOUR PASSWORD HERE>',
	proxy: '<PROXY: PORT>',
	// if not using any proxy, let proxy be empty string -> proxy: ''
}

// DO NOT REMOVE THE SINGLE QUOTES
const adminDetails = {
	emailId: '<EMAIL ID Of the admin goes here>',
	password: '<Admin PASSWORD GOES HERE>'
}

// set to true if installing for first time or to clear database
const resetDatabase = false;

//////////////// END OF CONFIGURATION /////////////////
			
// DEFAULT QUERIES TO BE EXECUTED AT SERVER START
			
module.exports = function(app){

	if(resetDatabase === true){
		resetSystem();
		for(let i = 101; i <= 200; i++){
			module.exports.insertGeneralRoom(i);
		}
		for(let i = 201; i <= 300; i++){
			module.exports.insertPersonalRoom(i);
		}
	}
			
	// delete old records 
	const d = new Date();
	const y = d.getFullYear() - 1;
	const m = d.getMonth() + 1;
	const date = d.getDate();
	const today = y + "-" + m + "-" + date;
	module.exports.deleteRecord(today);
}

module.exports resetSystem = function(){
	// delete data from all tables
	clearTable('city_state');
	clearTable('complain');
	clearTable('curr');
	clearTable('doctor');
	clearTable('employee');
	clearTable('employee_contact');
	clearTable('employee_email');
	clearTable('hardware');
	clearTable('login');
	clearTable('nurse');
	clearTable('patient');
	clearTable('record');
	clearTable('room');
	clearTable('server');
	addServer();
	insertState('Bangalore', 'Karnataka', function(){
		insertEmployee(1000,'Admin','male',0.00,'Manager',1234567890,adminDetails.emailId,'Somewhere on Earth','Bangalore', function(){
			const pass = adminDetails.password;
			bcrypt.hash(pass, 10, function (err, hash) {
				insertLogin(1000, hash);
			});
		});
	})
	
}

const clearTable = function(tableName){
	const query = "DELETE FROM " + tableName + ";";
	con.query(query);
}

const addServer = function(){
	let serverProxy;
	if(serverProxy === ''){
		serverProxy = 'NULL';
	}
	else{
		serverProxy = "'" + emailServerDetails.proxy + "'"
	}

	const query = "INSERT INTO server VALUES('" + emailServerDetails.emailId + "', '" + emailServerDetails.pass + "', " + serverProxy + ");";
	con.query(query);
}
			
			//------------------------------------------------------------------------------------------//
			
module.exports.deleteRecord = function(date, callback){
	const query = "DELETE FROM patient WHERE dol < '"+date+"';";
				con.query(query, callback);
			}
			
module.exports.insertAmail = function(userid, mail, callback){
	const query = "INSERT IGNORE INTO employee_email VALUES(" + userid + ", '" + mail + "');";
				con.query(query, callback);
			}
			
module.exports.insertAcontact = function(userid, contact, callback){
	const query = "INSERT IGNORE INTO employee_contact VALUES(" + userid + ", " + contact + ");";
				con.query(query, callback);
			}
			
module.exports.updateEmployeeSalary = function(userid, salary, callback){
      const query = "UPDATE employee SET salary = "+salary+" WHERE id = "+userid+";";
				con.query(query, callback);
	}
	
module.exports.updateEmployeeContact = function(userid, contact, callback){
      const query = "UPDATE employee SET contact = "+contact+" WHERE id = "+userid+";";
				con.query(query, callback);
	}
	
module.exports.updateEmployeeEmail = function(userid, email, callback){
      const query = "UPDATE employee SET email = '"+email+"' WHERE id = "+userid+";";
				con.query(query, callback);
	}
	
module.exports.updateEmployeeAddress = function(userid, address, callback){
      const query = "UPDATE employee SET address = '"+address+"' WHERE id = "+userid+";";
				con.query(query, callback);
	}
	
module.exports.updateEmployeeCity = function(userid, city, callback){
      const query = "UPDATE employee SET city = '"+city+"' WHERE id = "+userid+";";
				con.query(query, callback);
	}
	
module.exports.updateEmployeeAContact = function(userid, contact, callback){
      const query =  "UPDATE employee_contact SET contact = "+contact+" WHERE id = "+userid+";"
				con.query(query, callback);
	}
	
module.exports.updateEmployeeAemail = function(userid, mail, callback){
      const query =  "UPDATE employee_email SET email = '"+mail+"' WHERE id = "+userid+";"
				con.query(query, callback);
	}
	
module.exports.deleteAcontact = function(userid, callback){
	const query = "DELETE IGNORE FROM employee_contact WHERE id = "+userid+";";
				con.query(query, callback);
			}
			
module.exports.deleteAmail = function(userid, callback){
	const query = "DELETE IGNORE FROM employee_email WHERE id = "+userid+";";
				con.query(query, callback);
			}
			
module.exports.insertLogin = function(userid, pass, callback){
	const query = "INSERT INTO login VALUES("+userid+", '"+pass+"');"
				con.query(query, callback);
			}
			
module.exports.deleteLogin = function(userid, callback){
	const query = "DELETE IGNORE FROM login WHERE username = "+userid+";";
				con.query(query, callback);
			}
			
module.exports.getUserType = function(userid, callback){
  	const query = "SELECT login.username, employee.type FROM employee INNER JOIN login ON employee.id = login.username AND login.username = " + userid + " WHERE EXISTS (SELECT * FROM login WHERE username = " + userid + ");";
				con.query(query, callback);
		}
		
module.exports.getUserTypeById = function(userid, callback){
  	const query = "SELECT type FROM employee WHERE id = " + userid + ";";
				con.query(query, callback);
		}
		
module.exports.getUserById = function(userid, callback){
  	const query = "SELECT * FROM login WHERE username = " + userid + ";";
				con.query(query, callback);
		}
		
module.exports.newUserId = function(callback){
	const query = "SELECT MAX(id) as 'max' FROM employee;";
				con.query(query, callback);
			}
			
module.exports.insertEmployee = function(userid, name, sex, salary, type, contact, email, address, city, callback){
    const query = "INSERT INTO employee VALUES("+userid+", '"+name+"', '"+sex+"', "+salary+", '"+type+"', "+contact+", '"+email+"', '"+address+"', '"+city+"');";
				con.query(query, callback);
		}
		
module.exports.insertDoctor = function(userid, qual, type, exp, callback){
    const query = "INSERT INTO doctor VALUES("+ userid + ",'" + type + "', '" + qual + "', " + exp + ");";
				con.query(query, callback);
		}
		
		// CITY_STATE TABLE
		
module.exports.insertState = function(city, state, callback){
	const query = "INSERT IGNORE INTO city_state VALUES('" + city + "', '" + state + "');";
				con.query(query, callback);
			}
			
module.exports.insertNurse = function(userid, qual, exp, callback){
	const query = "INSERT INTO nurse VALUES("+ userid + ", '" + qual + "', " + exp + ");";
					con.query(query, callback);
			}
			
module.exports.deleteNurse = function(userid, callback){
	const query = "DELETE FROM nurse WHERE id = "+userid+";";
				con.query(query, callback);
			}
			
module.exports.getEmployeeDetails = function(userid, callback){
	const query = "SELECT * FROM employee WHERE id = " + userid +";";
				con.query(query, callback);
			}
			
module.exports.getState = function(city, callback){
	const query = "SELECT state FROM city_state where city = '" + city + "';";
				con.query(query, callback);
			}
			
module.exports.getAmail = function(userid, callback){
	const query = "SELECT email FROM employee_email where id = " + userid + ";";
				con.query(query, callback);
			}
			
module.exports.getAcontact = function(userid, callback){
	const query = "SELECT contact FROM employee_contact where id = " + userid + ";";
				con.query(query, callback);
			}
			
module.exports.changePassword = function(userid, pass, callback){
	const query = "UPDATE login SET password = '" + pass + "' WHERE username = " + userid + ";";
				con.query(query, callback);
			}
			
module.exports.getAllEmployee = function(callback){
	const query = "SELECT * FROM employee;";
				con.query(query, callback);
			}
			
module.exports.totalIncome = function(callback){
	const query = "SELECT SUM(salary) as 'income' FROM employee;";
				con.query(query, callback);
			}
			
module.exports.getEmployeeCount = function(type, callback){
	const query = "SELECT COUNT(id) as 'count' FROM employee WHERE type = '"+type+"';";
				con.query(query, callback);
			}
			
module.exports.deleteEmployee = function(userid, callback){
	const query = "DELETE FROM employee WHERE id = "+userid+";";
				con.query(query, callback);
			}
			
			// HARDWARE TABLE
			
module.exports.getAllHardware = function(callback){
	const query = "SELECT * FROM hardware;";
				con.query(query, callback);
			}
			
module.exports.getHardwareQuantity = function(model, callback){
	const query = "SELECT quantity FROM hardware WHERE model = '" + model + "';";
				con.query(query, callback);
			}
			
module.exports.insertHardware = function(model, type, quantity, callback){
	const query = "INSERT IGNORE INTO hardware VALUES('" + model + "', '" + type + "', " + quantity + ");";
				con.query(query, callback);
			}
			
module.exports.updateHardware = function(model, quantity, callback){
	const query = "UPDATE hardware SET quantity = " + quantity + " WHERE model = '" + model + "';";
				con.query(query, callback);
			}
			
module.exports.deleteHardware = function(model, callback){
	const query = "DELETE FROM hardware WHERE model = '" + model + "';";
				con.query(query, callback);
			}
			
			// DOCTOR TABLE
			
module.exports.getDoctorTypes = function(callback){
	const query = "SELECT type FROM doctor GROUP BY(type);";
				con.query(query, callback);
			}
			
module.exports.getDoctorDetails = function(userid, callback){
	const query = "SELECT * FROM doctor WHERE id = "+userid+";";
				con.query(query, callback);
			}
			
module.exports.getTypeCount = function(type, callback){
	const query = "SELECT COUNT(id) AS 'count' FROM doctor WHERE type = '"+type+"';";
				con.query(query, callback);
			}
			
module.exports.deleteDoctor = function(userid, callback){
	const query = "DELETE FROM doctor WHERE id = "+userid+";";
				con.query(query, callback);
			}
			
module.exports.getCompleteDoctorDetails = function(callback){
	const query = "SELECT * FROM employee INNER JOIN (SELECT id, type as 'dtype' FROM doctor) as D ON employee.id = D.id;";
				con.query(query, callback);
			}
			
			// PATIENT TABLE
			
module.exports.newPatientId = function(date, callback){
	const query = "SELECT MAX(id) as 'id' FROM patient WHERE doa = '" + date + "';";
				con.query(query, callback);
			}
			
module.exports.insertPatient = function(userid, name, sex, doa, address, city, contact, did, callback){
	const query = "INSERT INTO patient VALUES("+userid+", '"+name+"', '"+sex+"', '"+doa+"', '"+address+"', '"+city+"', "+contact+", "+did+", 000, NULL, 'CURRENT');";
				con.query(query, callback);
			}
			
module.exports.assignRoom = function(pid, doa, room, callback){
	const query = "UPDATE patient SET room = "+room+" WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.ePatient = function(pid, name, doa, did, callback){
	const query = "INSERT INTO patient VALUES("+pid+", '"+name+"', 'TO BE UPDATED', '"+doa+"', 'TO BE UPDATED', 'TO BE UPDATED', -1, "+did+", 000, NULL, 'EMERGENCY');";
				con.query(query, callback);
			}
			
module.exports.getEmergencyPatients = function(callback){
	const query = "SELECT * FROM (SELECT * FROM patient WHERE patient.status = 'EMERGENCY') AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
				con.query(query, callback);
			}
			
module.exports.updateEmergencyPatient = function(userid, sex, doa, address, city, contact, callback){
	const query = "UPDATE patient SET sex = '"+sex+"', address = '"+address+"', city = '"+city+"', contact = "+contact+", status = 'CURRENT' WHERE id = "+userid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.getPatientById = function(pid, doa, callback){
	const query = "SELECT * from patient WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.addDOL = function(pid, doa, date, callback){
	const query = "UPDATE patient SET dol = '"+date+"' WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.dischargePatient = function(pid, doa, callback){
	const query = "UPDATE patient SET status = 'DISCHARGED' WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.patientsToday = function(today, callback){
	const query = "SELECT COUNT(id) as 'ptoday' FROM patient WHERE doa = '"+today+"';";
				con.query(query, callback);
			}
			
module.exports.patientsThisMonth = function(date, callback){
	const query = "SELECT COUNT(id) as 'pmonth' FROM patient WHERE doa >= '"+date+"';";
				con.query(query, callback);
			}
			
module.exports.changeDoctor = function(pdid, ndid, callback){
	const query = "UPDATE patient SET d_id = "+ndid+" WHERE d_id = "+pdid+";";
				con.query(query, callback);
			}
			
			// CURR TABLE
			
module.exports.updateCurr = function(d_id, patients, callback){
	const query = "UPDATE curr SET patients = "+patients+" WHERE d_id = "+d_id+";";
				con.query(query, callback);
			}
			
module.exports.insertCurr = function(d_id, type, patients, callback){
	const query = "INSERT INTO curr VALUES("+d_id+", '"+type+"', "+patients+");";
				con.query(query, callback);
			}
			
module.exports.getDoctorIdPatients = function(type, callback){
	const query = "SELECT d_id, patients FROM curr WHERE patients = (SELECT MIN(patients) FROM curr WHERE type = '"+type+"') AND type = '"+type+"';";
				con.query(query, callback);
			}
			
module.exports.getDoctorEmergency = function(callback){
	const query = "SELECT d_id, patients FROM curr WHERE patients = (SELECT MIN(patients) FROM curr WHERE type = 'Surgeon') AND type = 'Surgeon';";
				con.query(query, callback);
			}
			
module.exports.deleteCurr = function(did, callback){
	const query = "DELETE FROM curr WHERE d_id = "+did+";";
				con.query(query, callback);
			}
			
module.exports.getCurr = function(did, callback){
	const query = "SELECT * FROM curr WHERE d_id = "+did+";";
				con.query(query, callback);
			}
			
			// RECORD TABLE
			
module.exports.createRecord = function(userid, did, doa, callback){
	const query = "INSERT INTO record VALUES("+userid+", "+did+", '"+doa+"', 'TO BE UPDATED', 'TO BE UPDATED', 0, 0, 0);";
				con.query(query, callback);
			}
			
module.exports.getRecords = function(callback){
	const query = "SELECT * FROM patient INNER JOIN record ON record.id = patient.id AND record.doa = patient.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = patient.d_id;";
				con.query(query, callback);
			}
			
module.exports.getRecordById = function(pid, doa, callback){
	const query = "SELECT * FROM record WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.getCompleteRecord = function(pid, doa, callback){
	const query = "select * from (select * from patient where patient.id = "+pid+" AND patient.doa = '"+doa+"') AS A INNER JOIN (select * from record where record.id = "+pid+" AND record.doa = '"+doa+"') AS B ON A.id = B.id AND A.doa = B.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id INNER JOIN city_state ON A.city = city_state.city;";
				con.query(query, callback);
			}
			
module.exports.getEmergencyRecord = function(pid, doa, callback){
	const query = "select * from (select * from patient where patient.id = "+pid+" AND patient.doa = '"+doa+"') AS A INNER JOIN (select * from record where record.id = "+pid+" AND record.doa = '"+doa+"') AS B ON A.id = B.id AND A.doa = B.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
				con.query(query, callback);
			}
			
module.exports.getCurrRecords = function(callback){
	const query = "SELECT * FROM (SELECT * FROM patient WHERE patient.status = 'CURRENT' OR patient.status = 'EMERGENCY') AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
				con.query(query, callback);
			}
			
module.exports.getCurrRecordById = function(pid, doa, callback){
	const query = "SELECT * FROM (SELECT * FROM patient WHERE patient.id = "+pid+" AND patient.doa = '"+doa+"' AND (patient.status = 'CURRENT' OR patient.status = 'EMERGENCY')) AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
				con.query(query, callback);
			}
			
module.exports.updateRecord = function(pid, doa, desc, meddesc, dfee, callback){
	const query = "UPDATE record SET description = '"+desc+"', medicines = '"+meddesc+"', d_fee = "+dfee+" WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.monthRevenue = function(date, callback){
	const query = "SELECT SUM(m_fee) AS 'm_fee', SUM(c_fee) AS 'c_fee', SUM(d_fee) AS 'd_fee' FROM record where doa >= '"+date+"';";
				con.query(query, callback);
			}
			
module.exports.getDoctorsPatients = function(did, callback){
	const query = "SELECT * FROM (SELECT * FROM patient WHERE (patient.status = 'CURRENT' OR patient.status = 'EMERGENCY') AND patient.d_id = "+did+") AS A INNER JOIN record ON record.id = A.id AND record.doa = A.doa INNER JOIN (SELECT employee.name as 'd_name', employee.id as 'e_id' FROM employee) AS T ON T.e_id = A.d_id;";
				con.query(query, callback);
			}
			
module.exports.changeDoctorRecord = function(pdid, ndid, callback){
	const query = "UPDATE record SET d_id = "+ndid+" WHERE d_id = "+pdid+";";
				con.query(query, callback);
			}
			
module.exports.updateMFee = function(pid, doa, mfee, callback){
	const query = "UPDATE record SET m_fee = "+mfee+" WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
module.exports.updateCFee = function(pid, doa, cfee, callback){
	const query = "UPDATE record SET c_fee = "+cfee+" WHERE id = "+pid+" AND doa = '"+doa+"';";
				con.query(query, callback);
			}
			
			// ROOM TABLE
			
module.exports.getGeneralRoom = function(callback){
	const query = "SELECT * FROM room WHERE patients = (SELECT MAX(patients) FROM room WHERE type = 'General' AND patients < 3) AND type = 'General';";
				con.query(query, callback);
			}
			
module.exports.getPersonalRoom = function(callback){
	const query = "SELECT * FROM room WHERE patients = (SELECT MAX(patients) FROM room WHERE type = 'Personal' AND patients < 1) AND type = 'Personal';";
				con.query(query, callback);
			}
			
module.exports.getEmergencyRoom = function(callback){
	const query = "SELECT MAX(id) as 'id' FROM room WHERE type = 'Emergency';";
				con.query(query, callback);
			}
			
module.exports.insertPersonalRoom = function(id, callback){
	const query = "INSERT INTO room VALUES("+id+", 'Personal', 0);";
				con.query(query, callback);
			}
			
module.exports.updateGeneralRoom = function(id, patients, callback){
	const query = "UPDATE room SET patients = "+patients+" WHERE id = "+id+";";
				con.query(query, callback);
			}
			
module.exports.updatePersonalRoom = function(id, patients, callback){
	const query = "UPDATE room SET patients = "+patients+" WHERE id = "+id+";";
				con.query(query, callback);
			}
			
module.exports.insertGeneralRoom = function(id, callback){
	const query = "INSERT INTO room VALUES("+id+", 'General', 0);";
				con.query(query, callback);
			}
			
module.exports.GeneralOccupied = function(callback){
	const query = "SELECT COUNT(id) AS 'groom' FROM room WHERE type = 'General' AND patients > 0;";
				con.query(query, callback);
			}
			
module.exports.PersonalOccupied = function(callback){
	const query = "SELECT COUNT(id) AS 'proom' FROM room WHERE type = 'Personal' AND patients > 0;";
				con.query(query, callback);
			}
			
module.exports.getRoomDetails = function(rid, callback){
	const query = "SELECT * FROM room WHERE id = "+rid+";";
				con.query(query, callback);
			}
			
module.exports.updateRoom = function(rid, patients, callback){
	const query = "UPDATE room SET patients = "+patients+" WHERE id = "+rid+";";
				con.query(query, callback);
			}
			
			// NURSE TABLE
			
module.exports.getNurseDetails = function(id, callback){
	const query = "SELECT * FROM nurse WHERE id = "+id+";";
				con.query(query, callback);
			}
			
			// SERVER TABLE
			
module.exports.deleteServer = function(callback){
	const query = "UPDATE server SET email = NULL, pass = NULL;";
				con.query(query, callback);
			}
			
module.exports.updateServer = function(email, pass, callback){
	const query = "UPDATE server SET email = '"+email+"', pass = '"+pass+"';";
				con.query(query, callback);
			}
			
module.exports.changeProxy = function(proxy, callback){
	const query = "UPDATE server SET proxy = '"+proxy+"';";
				con.query(query, callback);
			}
			
module.exports.deleteProxy = function(callback){
	const query = "UPDATE server SET proxy = NULL;";
				con.query(query, callback);
			}
			
module.exports.fetchServer = function(callback){
	const query = "SELECT * FROM server;";
				con.query(query, callback);
			}
			
			// COMPLAIN TABLE
			
module.exports.fileComplaint = function(id, date, name, type, description, callback){
	const query = "INSERT INTO complain VALUES("+id+", '"+date+"', '"+name+"', '"+type+"', '"+description+"');";
				con.query(query, callback);
			}
			
module.exports.getComplaintId = function(date, callback){
	const query = "SELECT MAX(id) as 'id' FROM complain WHERE dof = '"+date+"';";
				con.query(query, callback);
			}
			
module.exports.getComplaints = function(callback){
	const query = "SELECT * FROM complain;";
				con.query(query, callback);
			}
			
module.exports.getComplaintById = function(id, dof, callback){
	const query = "SELECT * FROM complain WHERE id = "+id+" AND dof = '"+dof+"';";
				con.query(query, callback);
			}
			
			
			
			
			
			
