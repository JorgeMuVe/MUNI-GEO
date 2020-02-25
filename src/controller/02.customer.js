/**
 * @file customer.js (ROLE: ADMINISTRATOR)
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtCustomer = require('express').Router();
const dataProvider = require('../db-conector.js');
const _ID_ = 2;

/*
DROP TABLE IF EXISTS customer;
DELIMITER //
	CREATE TABLE IF NOT EXISTS customer (
		id SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		labelCustomer VARCHAR(120) CHARACTER SET utf8 NOT NULL,
		labelOffice VARCHAR(120) CHARACTER SET utf8 NULL, -- mapApiKey VARCHAR(40) CHARACTER SET utf8 NULL, -- API KEY client ??
		isEnabled BINARY(1) NOT NULL DEFAULT 1
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 //
DELIMITER ;

ALTER TABLE customer AUTO_INCREMENT=60361;
INSERT INTO customer VALUES(NULL, 'World Connect', NULL, HEX(1));
INSERT INTO customer VALUES(NULL, 'Municipalidad Provincial del Cusco', 'Gerencia de Medio Ambiente', HEX(1));
*/

rtCustomer.get('/', async (request, response) => {
	/* 
	DROP PROCEDURE IF EXISTS lstClients;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstClients () 
		BEGIN
			SELECT 
				id AS codigoEntidad, 
				CONCAT (labelCustomer, ' - ', IFNULL(labelOffice,'')) AS denominacionEntidad 
			FROM 
				customer 
			WHERE 
				HEX(UNHEX(isEnabled))='01' 
			ORDER BY id DESC;
		END $$
	DELIMITER ; 

	-- CALL lstClients();
	*/
	try {
		await dataProvider.query("CALL lstClients( )",
		(error, result) => { 
			if (error)
				response.json({ 'error' : error });
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

rtCustomer.get('/paginado/:inicio/:numeroRutas', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstClientsByPage;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstClientsByPage (
			IN `@offset` INTEGER UNSIGNED,
			IN `@numberOf` INTEGER UNSIGNED
		) BEGIN
			SELECT 
				id AS codigoEntidad, 
				labelCustomer AS denominacionEntidad, 
				IFNULL(labelOffice,'') AS denominacionSubEntidad, 
				CAST(isEnabled AS INTEGER) AS habilitado
			FROM
				customer 
			ORDER BY id DESC
			LIMIT `@offset`, `@numberOf`; 
		END $$
	DELIMITER ;

	-- CALL lstClientsByPage(0, 10);
	*/
	try {
		await dataProvider.query("CALL lstClientsByPage(?, ?)", 
		[
			parseInt(request.params.inicio),
			parseInt(request.params.numeroRutas)
		], (error, result) => { 
			if (error)
				response.json({ error : error });
			else {
				if (result[0])
					response.json( result[0] ); 
				else
					response.json({ error : "vacio" });
			}
		});
		dataProvider.release(); 
	} catch (errorException) {
		response.json({ error : errorException.code });
	}
});

rtCustomer.get('/total', async (request, response) => {
	try {
		await dataProvider.query("SELECT count(*) as total FROM customer;", 
		(error, result) => { 
			if (error)
				response.json({ error : error });
			else {
				if (result[0])
					response.json( result[0] ); 
				else
					response.json({ error : "vacio" });
			}
		});
		dataProvider.release(); 
	} catch (errorException) {
		response.json({ error : errorException.code });
	}
});

rtCustomer.post('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS appendClient;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS appendClient (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@nameCustomer` VARCHAR(120) CHARACTER SET utf8,
			IN `@nameOffice` VARCHAR(120) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		START TRANSACTION;
			INSERT INTO customer VALUES(NULL, `@nameCustomer`, `@nameOffice`, HEX(1));
			SET @temporalId = LAST_INSERT_ID();
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, @temporalId, 0, CURRENT_TIMESTAMP);
		COMMIT;
		END //
	DELIMITER ;

	-- CALL appendClient(1, '017fe9af4f3c11ea9ebc208984f8714c', 'Empresa N', 'oficina 1', 2);
	*/
	try {
		let cliente = request.body.cliente;
		let nombre1 = request.body.nombre1;
		let nombre2 = request.body.nombre2;
		let firma = request.body.firma;
		// TO DO -- Check firma 
		await dataProvider.query("CALL appendClient(?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			nombre1,
			nombre2,
			_ID_
		], 
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : error });
			else {
				/* if (result[0])
					response.json( result[0] ); 
				else
					response.json({ error : "vacio" }); */
			}
		});
		dataProvider.release(); 
	} catch (errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtCustomer.patch('/disponibilidad/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS setEnabledStatusPerClient;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS setEnabledStatusPerClient (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@customerID` SMALLINT UNSIGNED,
			IN `@status` TINYINT(1) UNSIGNED,	
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		START TRANSACTION;
		-- IF EXISTS (SELECT `@sign` FROM session WHERE eSignSession=`@firma` AND ) THEN 
				IF `@status` = 0 THEN 
					UPDATE customer SET isEnabled=HEX(0) WHERE id=`@customerID`;
				ELSE
					UPDATE customer SET isEnabled=HEX(1) WHERE id=`@customerID`;
				END IF;
				INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@clientID`, 2, CURRENT_TIMESTAMP);
		-- END IF;
		COMMIT;
	END //
	DELIMITER ; 

	-- CALL setEnabledStatusPerClient(1, "bcb2e3d5482311ea868f208984f8714c", 2, 1, 1);
	*/
	try {
		let cliente = request.body.cliente; // CHECK API KEY on QUERY
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let estado = request.body.estado; // console.log( firma.length );
		if (firma.length !== 32) { 
			response.json({ 'error' : 'parámetro(s) INADECUADO(s)' }); 
		} else {
			await dataProvider.query("CALL setEnabledStatusPerClient(?, ?, ?, ?, ?)", 
			[
				parseInt(cliente),
				firma,
				parseInt(codigo),
				parseInt(estado),
				_ID_
			],
			(error, result) => { 
				if (error)
					response.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
				else {
					response.json({ w : result });
					//response.
					/*
					if (result[0])
						response.json( result[0] );  // Enviar result de consulta en JSON 
					else
						response.json({ error : "vacío" }); // Enviar error en JSON
					*/
				}
			});
			dataProvider.release();
		} // ELSE END
	} catch (errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtCustomer.patch('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS updateLabelsClient;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS updateLabelsClient (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@clientIDmodified` SMALLINT UNSIGNED,
			IN `@nom1` TEXT CHARACTER SET utf8,
			IN `@nom2` TEXT CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		START TRANSACTION;
			UPDATE 
				customer 
			SET 
				labelCustomer=`@nom1`, 
				labelOffice=`@nom2` 
			WHERE
				id=`@clientIDmodified`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@clientIDmodified`, 2, CURRENT_TIMESTAMP);
		COMMIT;
		END //
	DELIMITER ;

	-- CALL updateLabelsClient(60361, "bcb2e3d5482311ea868f208984f8714c", 60363, 'Empresa 2', 'Oficina editada', 2);
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let nombre1 = request.body.nombre1;
		let nombre2 = request.body.nombre2;
		// TO-DO
		await dataProvider.query("CALL updateLabelsClient(?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			nombre1,
			nombre2,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : error });
			else {
				response.json({ 'r' : 200 }); // result HTTP ???
			}
		});
		dataProvider.release(); 
	} catch (errorException) {
		response.json({ 'error' : errorException.code });
	}
});

module.exports = rtCustomer;