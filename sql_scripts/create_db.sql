CREATE DATABASE IF NOT EXISTS bpd_crime;
USE bpd_crime;

CREATE TABLE IF NOT EXISTS crime (
	id INTEGER AUTO_INCREMENT,
	crimedate DATE,
	crimetime TIME,
	crimecode VARCHAR(5),
	location VARCHAR(50),
	description VARCHAR(30),
	inside_outside CHAR(1),
	weapon VARCHAR(10),
	post INTEGER,
	district VARCHAR(20),
	neighborhood VARCHAR(50),
	longitude DOUBLE,
	latitude DOUBLE,
	premise VARCHAR(20),
	total_incidents INTEGER,
	PRIMARY KEY (id)
);
