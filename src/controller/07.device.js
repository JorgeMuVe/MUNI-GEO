/**
 * @file 07.device.js
 * @author {carrillog.luis[at]gmail[dot]com}
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtDevice = require('express').Router(),
	  dataProvider = require('../db-conector.js'),
	  _ID_ = 7;

/* 
DROP TABLE IF EXISTS deviceGPS;
DELIMITER //
	CREATE TABLE IF NOT EXISTS deviceGPS (
		id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,	
		idClient SMALLINT UNSIGNED NOT NULL,
		serialNumber VARCHAR(40) CHARACTER SET utf8 NULL, -- imeiNumber VARCHAR(17)
		label VARCHAR(120) CHARACTER SET utf8 NOT NULL,
		isEnabled BINARY(1) NOT NULL DEFAULT 1
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 //
DELIMITER ;

-- ALTER TABLE deviceGPS ADD CONSTRAINT FOREIGN KEY (idClient) REFERENCES customer(id);
*/

rtDevice.get('/paginado/:inicio/:numeroDispositivos/:entidad', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstDevicesByPagePerClient;
	DELIMITER $$
	CREATE PROCEDURE IF NOT EXISTS lstDevicesByPagePerClient (
		IN `@clientID` SMALLINT UNSIGNED,
		IN `@offset` INTEGER UNSIGNED,
		IN `@numberItems` INTEGER UNSIGNED
	) BEGIN
		SELECT 
			id AS codigoDispositivo, serialNumber AS numeroSerie, label AS denominacionDispositivo, CAST(isEnabled AS INTEGER) AS habilitado
		FROM 
			deviceGPS
		WHERE 
			idClient = `@clientID`  
		ORDER BY id DESC LIMIT `@offset`, `@numberItems`;           
		--  HEX(UNHEX(isEnabled))='01' AND
	END $$
	DELIMITER ;

	CALL lstDevicesByPagePerClient(60362, 0, 10);    
	*/
	try {  
		await dataProvider.query("CALL lstDevicesByPagePerClient(?, ?, ?)",
		[
			parseInt(request.params.entidad),
			parseInt(request.params.inicio),
			parseInt(request.params.numeroDispositivos),
		], 
		(error, result) => { 
			if (error)
				response.json({ 'error' : error });
			else {
				if (result[0])
					response.json( result[0] );
				else
					response.json({ 'error' : "vacío" });
			}
		});
		dataProvider.release();
	} catch (errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtDevice.get('/total', async (request, response) => {
	try {
		await dataProvider.query("SELECT count(*) AS total FROM deviceGPS;", 
		(error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) });
			else {
				if (result[0])
					response.json( result[0] ); 
				else
					response.json({ 'error' : "vacio" });
			}
		});
		dataProvider.release();
	} catch (errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtDevice.post('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS addDevicePerClient;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS addDevicePerClient (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` INTEGER UNSIGNED,
			IN `@serial` VARCHAR(40) CHARACTER SET utf8,
			IN `@lbl` VARCHAR(120) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			INSERT INTO deviceGPS VALUES (NULL, `@clientID`, `@serial`, `@lbl`, HEX(1));
			SET @temporalId = LAST_INSERT_ID();
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, @temporalId, 0, CURRENT_TIMESTAMP);
		END $$
	DELIMITER ;
	*/
	try {  
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let serial = request.body.serial;
		let denominacion = request.body.denominacion;

		await dataProvider.query("CALL addDevicePerClient(?, ?, ?, ?, ?)",
		[
			parseInt(cliente),
			firma,
			serial,
			denominacion,
			_ID_
		], 
		(error, result) => { 
			if (error)
				response.json({ 'error' : error });
			else {
				if (result[0])
					response.json( result[0] );
				else
					response.json({ error : "vacío" });
			}
		});
		dataProvider.release();
	} catch (errorException) {
		response.json({ error : errorException.code });
	}
});

rtDevice.patch('/disponibilidad/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS setEnabledStatusPerDevice;
		DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS setEnabledStatusPerDevice (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@deviceID` INTEGER UNSIGNED,
			IN `@status` TINYINT(1) UNSIGNED,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			IF `@status` = 0 THEN 
				UPDATE deviceGPS
				SET isEnabled=HEX(0) 
				WHERE id=`@deviceID`;
			ELSE
				UPDATE deviceGPS
				SET isEnabled=HEX(1) 
				WHERE id=`@deviceID`;
			END IF;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@deviceID`, 2, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let estado = request.body.estado;
		await dataProvider.query("CALL setEnabledStatusPerDevice(?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			estado,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : (error.sqlMessage + " - " + error.sql) });
			else {
				if(result[0])
					response.json( result[0] ); 
				else
					response.json({ 'error' : "vacío" });
			}
		});
		dataProvider.release(); 
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtDevice.patch('/denominacion/referencias', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS updateDataPerDevice;
		DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS updateDataPerDevice (
			
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@deviceID` INTEGER UNSIGNED,
			
			IN `@serialNum` VARCHAR(40) CHARACTER SET utf8,
			IN `@label_` VARCHAR(120) CHARACTER SET utf8,

			IN `@module` TINYINT(1) UNSIGNED

		) BEGIN        
			UPDATE 
				deviceGPS
			SET 
				serialNumber=`@serialNum`,
				label=`@label_`     
			WHERE 
				id=`@deviceID`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@vdeviceID`, 2, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;

		let serie = request.body.serie;
		let denominacion = request.body.denominacion;
		
		await dataProvider.query("CALL updateDataPerDevice(?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			serie,
			denominacion,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : (error.sqlMessage + " - " + error.sql) });
			else {
				if(result[0])
					response.json( result[0] ); 
				else
					response.json({ 'error' : "vacío" });
			}
		});
		dataProvider.release(); 
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

module.exports = rtDevice;