# HIMS

Hospital Information Management System - Supports most of the standard HIMS functionalities:

* Staff Management
* Appointment Management
* Complaint Portal
* Staff Dashboard
* Staff Recruitment
* Hardware Management
* Report Management and Bills
* Mailing Service
* Emergency Patient
* Room Management

# KEY POINTS

* Back-End Technologies: Node Js + MySQL
* Front-End Technologies: HTML, CSS, BootStrap, JavaScript, EJS
* Authentication provided using passport-js
* Password Hashed using bcrypt-js
* Mailing Service provided using nodemailer

# SCREENSHOTS

![scr1](https://github.com/dumbape/HIMS/blob/master/home.png?raw=true)
![scr2](https://github.com/dumbape/HIMS/blob/master/complain.png?raw=true)
![scr3](https://github.com/dumbape/HIMS/blob/master/login.png?raw=true)
![scr4](https://github.com/dumbape/HIMS/blob/master/Dashboard.png?raw=true)
![scr5](https://github.com/dumbape/HIMS/blob/master/settings.png?raw=true)
![scr6](https://github.com/dumbape/HIMS/blob/master/Emergency.png?raw=true)
![scr7](https://github.com/dumbape/HIMS/blob/master/admit.png?raw=true)
![scr8](https://github.com/dumbape/HIMS/blob/master/report.png?raw=true)

# INSTALL

* git clone https://github.com/dumbape/HIMS.git

* `cd HIMS`

* Make sure to have Node Js installed in your system. [Optional - Install package nodemon to waatch as you develop]

* Run `npm install`

* Make sure to have all dependencies in your local folder, or installed globally in your system

* Import the file `database.sql` in your mySQL.

* `db_controller` controls the database operations. Specify your database details there (modify the configuration section at the start of the file).
  
* RUN `node main.js`

* Open `http://localhost:3000/home` in any browser

# CREDITS

The templates have been obtained from different sources. I do not own any rights on them.
* LANDING PAGE - Infinity - https://www.styleshout.com/free-templates/infinity/
* DASHBOARD - SB-Admin - https://startbootstrap.com/template-overviews/sb-admin/



