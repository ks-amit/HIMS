-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: hms
-- ------------------------------------------------------
-- Server version	5.7.22-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `city_state`
--

DROP TABLE IF EXISTS `city_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city_state` (
  `city` varchar(30) NOT NULL,
  `state` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city_state`
--

LOCK TABLES `city_state` WRITE;
/*!40000 ALTER TABLE `city_state` DISABLE KEYS */;
INSERT INTO `city_state` VALUES ('Allahabad','Uttar Pradesh'),('Bangalore','Karnataka'),('Bhatinda','Punjab'),('Chandigarh','Chandigarh'),('Chennai','Tamil Nadu'),('Dehradun','Himachal Pradesh'),('Delhi','Delhi'),('Indore','Madhya Pradesh'),('Jaipur','Rajasthan'),('Kolkata','West Bengal'),('Mumbai','Maharashtra'),('Punjab','Amritsar');
/*!40000 ALTER TABLE `city_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complain`
--

DROP TABLE IF EXISTS `complain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `complain` (
  `id` int(11) DEFAULT NULL,
  `dof` date DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complain`
--

LOCK TABLES `complain` WRITE;
/*!40000 ALTER TABLE `complain` DISABLE KEYS */;
INSERT INTO `complain` VALUES (100,'2018-04-17','Amit K S','Management','Poor Management'),(100,'2018-04-18','Ajay','Other','Bill Too High'),(101,'2018-04-18','efsefe','Staff','assfsg'),(102,'2018-04-18','Amit','Other','rhtyjtyjtyjyukyu'),(100,'2018-04-21','qwerty','Treatment Quality','qwerty'),(101,'2018-04-21','pasha','Facilities','gaand me khujli hai');
/*!40000 ALTER TABLE `complain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curr`
--

DROP TABLE IF EXISTS `curr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curr` (
  `d_id` int(11) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  `patients` int(11) DEFAULT NULL,
  KEY `d_id` (`d_id`),
  CONSTRAINT `curr_ibfk_1` FOREIGN KEY (`d_id`) REFERENCES `doctor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curr`
--

LOCK TABLES `curr` WRITE;
/*!40000 ALTER TABLE `curr` DISABLE KEYS */;
INSERT INTO `curr` VALUES (1004,'Surgeon',3),(1009,'Surgeon',2),(1010,'Physician',2);
/*!40000 ALTER TABLE `curr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor` (
  `id` int(11) NOT NULL,
  `qual` varchar(30) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  KEY `id` (`id`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1004,'M.D','Surgeon',2),(1009,'asd','Surgeon',2),(1010,'bla','Physician',2);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `salary` double(12,2) NOT NULL,
  `type` varchar(20) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(200) NOT NULL,
  `city` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1000,'Amit K S','Male',0.00,'Manager',8830608685,'iit2016107@iiita.ac.in','Somewhere on Earth','Bangalore'),(1003,'Rec1','male',50000.00,'Receptionist',1234567890,'rec@hms.com','Earth, Solar System, Universe','Delhi'),(1004,'Doc1','male',230000.00,'Doctor',1234567890,'bla@bla.com','Earth, Solar System, Universe','Delhi'),(1007,'freg','male',15000.00,'Maintenance',1234567890,'iit2016107@iiita.ac.in','Earth, Solar System, Universe','Delhi'),(1008,'sefegerg','male',30000.00,'Nurse',1234567890,'iit2016107@iiita.ac.in','Bla Bla Bla','Delhi'),(1009,'sff','male',100000.00,'Doctor',1234567890,'iit2016107@iiita.ac.in','qwert','Delhi'),(1010,'Random','male',123456.00,'Doctor',1234567890,'iwc2017009@iiita.ac.in','Bla Bla Bla','Delhi');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_contact`
--

DROP TABLE IF EXISTS `employee_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_contact` (
  `id` int(11) NOT NULL,
  `contact` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `employee_contact_ibfk_1` FOREIGN KEY (`id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_contact`
--

LOCK TABLES `employee_contact` WRITE;
/*!40000 ALTER TABLE `employee_contact` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_email`
--

DROP TABLE IF EXISTS `employee_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_email` (
  `id` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `employee_email_ibfk_1` FOREIGN KEY (`id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_email`
--

LOCK TABLES `employee_email` WRITE;
/*!40000 ALTER TABLE `employee_email` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hardware`
--

DROP TABLE IF EXISTS `hardware`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hardware` (
  `model` varchar(20) NOT NULL,
  `type` varchar(30) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`model`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hardware`
--

LOCK TABLES `hardware` WRITE;
/*!40000 ALTER TABLE `hardware` DISABLE KEYS */;
INSERT INTO `hardware` VALUES ('M101','Medical Imaging',7),('M104','CT Scan',10),('M107','Medical Ultrasound',9),('M116','MRI',2),('M121','PET',6),('M133','XRAY',5),('M140','MRI',5);
/*!40000 ALTER TABLE `hardware` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login` (
  `username` int(11) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  KEY `username` (`username`),
  CONSTRAINT `login_ibfk_1` FOREIGN KEY (`username`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1000,'$2a$10$zJBRy0R6sZNDQUIksz.CeOk30sWzOd8VJ2oQ3.b4XN9WN03nydlL6'),(1003,'$2a$10$z/BJnDMNw/lY5Fosl0tzJuEvvFewzljywrRJAbOIGJqSXnjqYrrJ6'),(1004,'$2a$10$Rq9W.8Qaue.iOEUo1dE.E.YUlbs8kmkmzMjf825oY9LNYYrKSEbiK'),(1007,'$2a$10$v.Ulk5eLcfK7a3Nj.RKpIe0.bKOg04w3ygoJUY/4e6PxeBAsoUvCe'),(1008,'$2a$10$dCKvJxCNQs1QLZx81gl6uuu2kE/VLHXEq8DhmWD3K7ioPs8.IDWqu'),(1009,'$2a$10$o2PDrBs4E4tNxzPYCkNuOedq.BqB4XA12pkGGC9oEbpPpejHe2Hp2'),(1010,'$2a$10$QZO4vi0zeVs61pXgu8VTCePAi5MIFdjNKt09ljlVNxgIANGioF4ve');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nurse`
--

DROP TABLE IF EXISTS `nurse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nurse` (
  `id` int(11) DEFAULT NULL,
  `qual` varchar(20) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  KEY `id` (`id`),
  CONSTRAINT `nurse_ibfk_1` FOREIGN KEY (`id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nurse`
--

LOCK TABLES `nurse` WRITE;
/*!40000 ALTER TABLE `nurse` DISABLE KEYS */;
INSERT INTO `nurse` VALUES (1008,'bla',2);
/*!40000 ALTER TABLE `nurse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patient` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `sex` varchar(20) DEFAULT NULL,
  `doa` date NOT NULL,
  `address` varchar(200) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `contact` bigint(20) DEFAULT NULL,
  `d_id` int(11) DEFAULT NULL,
  `room` int(11) DEFAULT NULL,
  `dol` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`,`doa`),
  KEY `d_id` (`d_id`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`d_id`) REFERENCES `doctor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (10001,'P1','Male','2018-04-16','Bla Bla Bla','Delhi',1234567890,1004,101,'2018-04-18','DISCHARGED'),(10001,'Aashutosh Mundra','Male','2018-04-18','qwerty','Delhi',1234567890,1009,0,NULL,'CURRENT'),(10001,'Mradul Kumar','TO BE UPDATED','2018-04-21','TO BE UPDATED','TO BE UPDATED',-1,1004,0,NULL,'EMERGENCY'),(10002,'P2','Female','2018-04-16','bla','Delhi',1234567890,1004,201,'2018-04-16','CURRENT'),(10002,'rhrthh','Male','2018-04-18','qwerty','Delhi',1234567890,1010,0,NULL,'CURRENT'),(10003,'P3','Male','2018-04-16','bla','Delhi',1234567890,1004,101,'2018-04-16','DISCHARGED'),(10003,'trhrthrhrt','Male','2018-04-18','qwerty','Delhi',1234567890,1010,0,NULL,'CURRENT'),(10004,'P4','Male','2018-04-16','bla bla ','Delhi',1234567890,1004,101,NULL,'CURRENT'),(10004,'grgrthtr','TO BE UPDATED','2018-04-18','TO BE UPDATED','TO BE UPDATED',-1,1009,0,NULL,'EMERGENCY'),(10005,'Mradul Kumar','TO BE UPDATED','2018-04-16','TO BE UPDATED','TO BE UPDATED',-1,1004,0,'2018-04-16','DISCHARGED');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record`
--

DROP TABLE IF EXISTS `record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `record` (
  `id` int(11) NOT NULL,
  `d_id` int(11) DEFAULT NULL,
  `doa` date NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `medicines` varchar(200) DEFAULT NULL,
  `m_fee` double(10,2) DEFAULT NULL,
  `c_fee` double(10,2) DEFAULT NULL,
  `d_fee` double(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`,`doa`),
  KEY `d_id` (`d_id`),
  CONSTRAINT `record_ibfk_1` FOREIGN KEY (`d_id`) REFERENCES `doctor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record`
--

LOCK TABLES `record` WRITE;
/*!40000 ALTER TABLE `record` DISABLE KEYS */;
INSERT INTO `record` VALUES (10001,1004,'2018-04-16','hththjtyjtyjtyjt','dfgtrhrthrhrt',0.00,0.00,500.00),(10001,1009,'2018-04-18','You will be healthy','TO BE UPDATED',0.00,0.00,300.00),(10001,1004,'2018-04-21','TO BE UPDATED','TO BE UPDATED',0.00,0.00,0.00),(10002,1004,'2018-04-16','You will be dead soon','Something ',0.00,0.00,350.00),(10002,1010,'2018-04-18','TO BE UPDATED','TO BE UPDATED',0.00,0.00,0.00),(10003,1004,'2018-04-16','TO BE UPDATED','TO BE UPDATED',0.00,0.00,0.00),(10003,1010,'2018-04-18','TO BE UPDATED','TO BE UPDATED',0.00,0.00,0.00),(10004,1004,'2018-04-16','TO BE UPDATED','TO BE UPDATED',0.00,0.00,0.00),(10004,1009,'2018-04-18','TO BE UPDATED','TO BE UPDATED',0.00,0.00,0.00),(10005,1004,'2018-04-16','TO BE UPDATED','TO BE UPDATED',0.00,0.00,0.00);
/*!40000 ALTER TABLE `record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `type` varchar(30) DEFAULT NULL,
  `patients` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (101,'General',1),(102,'General',0),(103,'General',0),(104,'General',0),(105,'General',0),(106,'General',0),(107,'General',0),(108,'General',0),(109,'General',0),(110,'General',0),(111,'General',0),(112,'General',0),(113,'General',0),(114,'General',0),(115,'General',0),(116,'General',0),(117,'General',0),(118,'General',0),(119,'General',0),(120,'General',0),(121,'General',0),(122,'General',0),(123,'General',0),(124,'General',0),(125,'General',0),(126,'General',0),(127,'General',0),(128,'General',0),(129,'General',0),(130,'General',0),(131,'General',0),(132,'General',0),(133,'General',0),(134,'General',0),(135,'General',0),(136,'General',0),(137,'General',0),(138,'General',0),(139,'General',0),(140,'General',0),(141,'General',0),(142,'General',0),(143,'General',0),(144,'General',0),(145,'General',0),(146,'General',0),(147,'General',0),(148,'General',0),(149,'General',0),(150,'General',0),(151,'General',0),(152,'General',0),(153,'General',0),(154,'General',0),(155,'General',0),(156,'General',0),(157,'General',0),(158,'General',0),(159,'General',0),(160,'General',0),(161,'General',0),(162,'General',0),(163,'General',0),(164,'General',0),(165,'General',0),(166,'General',0),(167,'General',0),(168,'General',0),(169,'General',0),(170,'General',0),(171,'General',0),(172,'General',0),(173,'General',0),(174,'General',0),(175,'General',0),(176,'General',0),(177,'General',0),(178,'General',0),(179,'General',0),(180,'General',0),(181,'General',0),(182,'General',0),(183,'General',0),(184,'General',0),(185,'General',0),(186,'General',0),(187,'General',0),(188,'General',0),(189,'General',0),(190,'General',0),(191,'General',0),(192,'General',0),(193,'General',0),(194,'General',0),(195,'General',0),(196,'General',0),(197,'General',0),(198,'General',0),(199,'General',0),(200,'General',0),(201,'Personal',1),(202,'Personal',0),(203,'Personal',0),(204,'Personal',0),(205,'Personal',0),(206,'Personal',0),(207,'Personal',0),(208,'Personal',0),(209,'Personal',0),(210,'Personal',0),(211,'Personal',0),(212,'Personal',0),(213,'Personal',0),(214,'Personal',0),(215,'Personal',0),(216,'Personal',0),(217,'Personal',0),(218,'Personal',0),(219,'Personal',0),(220,'Personal',0),(221,'Personal',0),(222,'Personal',0),(223,'Personal',0),(224,'Personal',0),(225,'Personal',0),(226,'Personal',0),(227,'Personal',0),(228,'Personal',0),(229,'Personal',0),(230,'Personal',0),(231,'Personal',0),(232,'Personal',0),(233,'Personal',0),(234,'Personal',0),(235,'Personal',0),(236,'Personal',0),(237,'Personal',0),(238,'Personal',0),(239,'Personal',0),(240,'Personal',0),(241,'Personal',0),(242,'Personal',0),(243,'Personal',0),(244,'Personal',0),(245,'Personal',0),(246,'Personal',0),(247,'Personal',0),(248,'Personal',0),(249,'Personal',0),(250,'Personal',0),(251,'Personal',0),(252,'Personal',0),(253,'Personal',0),(254,'Personal',0),(255,'Personal',0),(256,'Personal',0),(257,'Personal',0),(258,'Personal',0),(259,'Personal',0),(260,'Personal',0),(261,'Personal',0),(262,'Personal',0),(263,'Personal',0),(264,'Personal',0),(265,'Personal',0),(266,'Personal',0),(267,'Personal',0),(268,'Personal',0),(269,'Personal',0),(270,'Personal',0),(271,'Personal',0),(272,'Personal',0),(273,'Personal',0),(274,'Personal',0),(275,'Personal',0),(276,'Personal',0),(277,'Personal',0),(278,'Personal',0),(279,'Personal',0),(280,'Personal',0),(281,'Personal',0),(282,'Personal',0),(283,'Personal',0),(284,'Personal',0),(285,'Personal',0),(286,'Personal',0),(287,'Personal',0),(288,'Personal',0),(289,'Personal',0),(290,'Personal',0),(291,'Personal',0),(292,'Personal',0),(293,'Personal',0),(294,'Personal',0),(295,'Personal',0),(296,'Personal',0),(297,'Personal',0),(298,'Personal',0),(299,'Personal',0),(300,'Personal',0);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server`
--

DROP TABLE IF EXISTS `server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `server` (
  `email` varchar(50) DEFAULT NULL,
  `pass` varchar(30) DEFAULT NULL,
  `proxy` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server`
--

LOCK TABLES `server` WRITE;
/*!40000 ALTER TABLE `server` DISABLE KEYS */;
INSERT INTO `server` VALUES ('hmanagerserver@gmail.com','hmanager','172.31.1.5:8080');
/*!40000 ALTER TABLE `server` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-07 23:41:43
