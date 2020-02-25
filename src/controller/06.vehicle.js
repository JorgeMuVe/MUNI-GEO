/**
 * @file 06.vehicle.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtVehicle = require('express').Router(),
 	  dataProvider = require('../db-conector.js'),
	  _ID_ = 6;

/*
DROP TABLE IF EXISTS vehicle;
DELIMITER //
	CREATE TABLE IF NOT EXISTS vehicle (
		id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		idClient SMALLINT UNSIGNED NOT NULL,
		license CHAR(6) CHARACTER SET utf8 NOT NULL,
		-- description TEXT NULL,
		isEnabled BINARY(1) NOT NULL DEFAULT 1
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 //
DELIMITER ;

-- ALTER TABLE vehicle ADD CONSTRAINT FOREIGN KEY (idClient) REFERENCES customer(id);
*/

rtVehicle.get('/componente/:entidad', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS listVehicles;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS listVehicles (
			IN `@entidad` SMALLINT UNSIGNED
		) BEGIN
			SELECT id AS codigoUnidadRecolectora, license AS identificadorUnidadRecolectora
			FROM vehicle 
			WHERE idClient=`@entidad` AND HEX(UNHEX(isEnabled))='01'
			ORDER BY id DESC;
		END $$
	DELIMITER ;

	-- CALL listVehicles(1);
	*/
	try {
		await dataProvider.query("CALL listVehicles(?)", 
		[
			parseInt(request.params.entidad)
		], 
		(error, result) => { 
			if (error)
				response.json({ 'error' : (error.sqlMessage + " - " + error.sql) });
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

rtVehicle.get('/paginado/:inicio/:numeroVehiculos/:entidad', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstVehiclesByPage;
		DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstVehiclesByPage (
			IN `@inicio` INTEGER UNSIGNED,
			IN `@numero` INTEGER UNSIGNED,
			IN `@entidad` SMALLINT UNSIGNED
		) BEGIN
			SELECT 
				id AS codigoUnidadRecolectora, 
				license AS identificadorUnidadRecolectora, 
				CAST(isEnabled AS INTEGER) AS habilitado 
			FROM 
				vehicle 
			WHERE idClient = `@entidad` 
			ORDER BY id DESC LIMIT `@inicio`, `@numero`; 
		END	$$
	DELIMITER ;

	CALL lstVehiclesByPage(0, 10, 60362);
	*/
	try {
		await dataProvider.query("CALL lstVehiclesByPage(?, ?, ?)", 
		[
			parseInt(request.params.inicio),
			parseInt(request.params.numeroVehiculos),
			parseInt(request.params.entidad)
		], 
		(error, result) => { 
			if (error)
				response.json({ 'error' : (error.sqlMessage + " - " + error.sql) });
			else {
				if (result[0])
					response.json( result[0] ); 
				else
					response.json({ 'error' : "vacio" });
			}
		});
		dataProvider.release(); 
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtVehicle.get('/total', async (request, response) => {
	try {
		await dataProvider.query("SELECT count(*) AS total FROM vehicle;", 
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

rtVehicle.post('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS appendVehicle;
		DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS appendVehicle (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8, 
			IN `@license` CHAR(6) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			-- IF `@compactador` = 0 THEN
			-- INSERT INTO vehicle VALUES(NULL, `@placa`, `@fabricante`, `@modelo`, HEX(0), HEX(1));
			-- ELSE
			-- INSERT INTO vehicle VALUES(NULL, `@placa`, `@fabricante`, `@modelo`, HEX(1), HEX(1));
			-- END IF;
			INSERT INTO vehicle VALUES(NULL, `@clientID`, `@license`, HEX(1));
			SET @temporalId = LAST_INSERT_ID();
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, @temporalId, 0, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;

	CALL appendVehicle(60362, '017fe9af4f3c11ea9ebc208984f8714c', 'xyz123', 6);

	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma; // fabricante,			modelo,
		let placa = request.body.placa; // let fabricante = request.body.fabricante; let modelo = request.body.modelo; let compactador = request.body.compactador;
		await dataProvider.query("CALL appendVehicle(?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			placa,
			_ID_
		]
		,(error, result) => { 
			if (error)
				response.json({ error : error });
			else {
				if( result[0] )
					response.json( result[0] );
				else
					response.json({ error : "vacío" });
			}
		});
		dataProvider.release(); //Liberar la conexión usada del POOL de conexiones 
	} catch(errorException) {
		response.json({ error : errorException.code });
	}
});

rtVehicle.patch('/disponibilidad/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS setEnabledStatusPerVehicle;
		DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS setEnabledStatusPerVehicle (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@vehicleID` INTEGER UNSIGNED,
			IN `@status` TINYINT(1) UNSIGNED,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			IF `@status` = 0 THEN 
				UPDATE vehicle 
				SET isEnabled=HEX(0) 
				WHERE id=`@vehicleID`;
			ELSE
				UPDATE vehicle 
				SET isEnabled=HEX(1) 
				WHERE id=`@vehicleID`;
			END IF;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@vehicleID`, 2, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let estado = request.body.estado;
		await dataProvider.query("CALL setEnabledStatusPerVehicle(?, ?, ?, ?, ?)", 
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

rtVehicle.patch('/denominacion/placa', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS changeLicenseVehicle;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS changeLicenseVehicle (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@vehicleID` INTEGER UNSIGNED,    
			IN `@license` CHAR(6) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			UPDATE vehicle 
			SET 
				license=`@license`
			WHERE 
				id=`@vehicleID`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@vehicleID`, 2, CURRENT_TIMESTAMP);
		END	//
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let denominacion = request.body.denominacion;

		await dataProvider.query("CALL changeLicenseVehicle(?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			denominacion,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : (error.sqlMessage + " - " + error.sql) });
			else {
				if( result[0] )
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

module.exports = rtVehicle;
/*
-- IN `@fabricante` VARCHAR(120) CHARACTER SET utf8,
-- IN `@modelo` VARCHAR(120) CHARACTER SET utf8,
-- IN `@compactador` TINYINT(1) UNSIGNED,
-- IN `@firma` CHAR(32) CHARACTER SET utf8
*/
/*
-- fabricanteUnidadRecolectora VARCHAR(120) CHARACTER SET utf8 NULL,
-- modeloUnidadRecolectora VARCHAR(120) CHARACTER SET utf8 NULL,
-- esCompactador BINARY(1) NOT NULL DEFAULT 0,
-- IFNULL(fabricanteUnidadRecolectora, '') AS fabricanteUnidadRecolectora, 
-- IFNULL(modeloUnidadRecolectora, '') AS modeloUnidadRecolectora, CAST(esCompactador AS INTEGER) AS esCompactador, 
*/
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
// https://dzone.com/articles/hash-with-a-side-of-javascript