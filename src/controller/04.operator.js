/**
 * @file personal.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtOperator = require('express').Router(),
	  dataProvider = require('../db-conector.js'),
	  _ID_ = 4;

/*
DROP TABLE IF EXISTS operator;
DELIMITER //
	CREATE TABLE IF NOT EXISTS operator (
		id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		idClient SMALLINT UNSIGNED NOT NULL, -- FK
		docType CHAR(1) CHARACTER SET utf8 NOT NULL,
		idDocument VARCHAR(14) CHARACTER SET utf8 NOT NULL CHECK(length(idDocument) >= 8),
		firstName VARCHAR(40) CHARACTER SET utf8 NOT NULL,
		lastName VARCHAR(40) CHARACTER SET utf8 NOT NULL,
		mothersLastName VARCHAR(40) CHARACTER SET utf8 NULL,
		isEnabled BINARY(1) NOT NULL DEFAULT 1
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 //
DELIMITER ;

ALTER TABLE operator ADD CONSTRAINT FOREIGN KEY (idClient) REFERENCES customer(id); 

-- INSERT INTO operator VALUES(NULL, 60362, 1, '12345678', 'Persona 1', 'Apellido 1', NULL, HEX(1)); 
*/

rtOperator.get('/componente/:entidad', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstOperatorsByClient;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstOperatorsByClient (
			IN `@clientID` INTEGER UNSIGNED
		) BEGIN
			SELECT 
				id AS codigoPersona, 
				CONCAT(UPPER(lastName), ' ', UPPER(IFNULL(mothersLastName,'')), ', ', firstName) AS nombreCompleto
			FROM 
				operator
			WHERE 
				idClient = `@clientID` AND HEX(UNHEX(isEnabled)) = '01'
			ORDER BY id DESC;
		END $$
	DELIMITER ;

	-- CALL lstOperatorsByClient(60362);
	*/
	try {
		await dataProvider.query("CALL lstOperatorsByClient(?)", 
		[
			parseInt(request.params.entidad)
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
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtOperator.get('/paginado/:inicio/:numeroPersonas/:entidad', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstOperatorsByPage;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstOperatorsByPage (
			IN `@offsetStart` INTEGER UNSIGNED,
			IN `@numberItems` INTEGER UNSIGNED,
			IN `@clientID` INTEGER UNSIGNED
		) BEGIN
			SELECT 
				id AS codigoPersona, 
				docType AS tipoDocumentoIdentificatorio, 
				idDocument AS numeroDocumentoIdentificatorio, 
				firstName AS nombre, 
				lastName AS apellidoPaterno, 
				IFNULL(mothersLastName, '') AS apellidoMaterno, 
				CAST(isEnabled AS INTEGER) as habilitado  
			FROM operator
			WHERE idClient = `@clientID`  
			ORDER BY id DESC
			LIMIT `@offsetStart`, `@numberItems`;
		END $$
	DELIMITER ;

	-- CALL lstOperatorsByPage(0, 10, 60362);    
	*/
	try {  
		await dataProvider.query("CALL lstOperatorsByPage(?, ?, ?)", 
		[
			parseInt(request.params.inicio),
			parseInt(request.params.numeroPersonas),
			parseInt(request.params.entidad)
		],
		(error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) });
			else {
				if (result[0])
					response.json( result[0] );
				else
					response.json({ error : "vacío" });
			}
		});
		dataProvider.release(); 
	} catch(errorException) {
		response.json({ error : errorException.code });
	}
});

rtOperator.get('/total', async (request, response) => {
	try {  
		await dataProvider.query("SELECT count(*) AS total FROM operator;", 
		(error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) });
			else {
				if (result[0])
					response.json( result[0] );
				else
					response.json({ error : "vacío" });
			}
		});
		dataProvider.release();
	} catch(errorException) {
		response.json({ error : errorException.code });
	}
});

rtOperator.patch('/disponibilidad/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS setEnabledStatusOperator;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS setEnabledStatusOperator (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@operatorID` INTEGER UNSIGNED,
			IN `@status_` TINYINT(1) UNSIGNED,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		-- START TRANSACTION;
			IF `@status_` = 0 THEN 
				UPDATE operator SET isEnabled=HEX(0) WHERE id=`@operatorID`;
			ELSE
				UPDATE operator SET isEnabled=HEX(1) WHERE id=`@operatorID`;
			END IF;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@operatorID`, 2, CURRENT_TIMESTAMP);
		-- COMMIT;
		END	//
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let codigo = request.body.codigo;
		let estado = request.body.estado;
		let firma = request.body.firma;
		
		await dataProvider.query("CALL setEnabledStatusOperator(?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			estado,
			_ID_
		],
		(error, result) => { 
			if (error)
				response.json({ 'error' : error }); // Enviar error en JSON -- (error.sqlMessage + " - " + error.sql)
			else {
				if (result[0])
					response.json( result[0] ); 
				else
					response.json({ 'error' : "vacío" });
			}
		});		
		dataProvider.release(); 
	} catch(errorException) {
		response.json({ error : errorException.code });
	}
});

rtOperator.post('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS addOperator;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS addOperator (
			IN `@clientID` SMALLINT UNSIGNED,  
			IN `@sign` CHAR(32) CHARACTER SET utf8,

			IN `@tipo` CHAR(1) CHARACTER SET utf8,
			IN `@documento` VARCHAR(14) CHARACTER SET utf8,
			IN `@nombre` VARCHAR(40) CHARACTER SET utf8,
			IN `@apPaterno` VARCHAR(40) CHARACTER SET utf8,
			IN `@apMaterno` VARCHAR(40) CHARACTER SET utf8,

			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		-- START TRANSACTION;
			INSERT INTO operator VALUES(NULL, `@clientID`, `@tipo`, `@documento`, `@nombre`, `@apPaterno`, `@apMaterno`, HEX(1));
			
			SET @temporalId = LAST_INSERT_ID();
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, @temporalId, 0, CURRENT_TIMESTAMP);
		-- COMMIT;
		END	//
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let tipo = request.body.tipo;
		let documento = request.body.documento;
		let n_ = request.body.nombre;
		let ap_ = request.body.paterno;
		let am_ = request.body.materno;
		let firma = request.body.firma;
		await dataProvider.query("CALL addOperator(?, ?, ?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			tipo,
			documento,
			n_,
			ap_,
			am_,
			_ID_
		]
		,(error, result) => { 
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

rtOperator.patch('/denominacion', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS resetLabelsOnOperator;
		DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS resetLabelsOnOperator (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@codigoPersona` INTEGER UNSIGNED,    
			IN `@nombre` VARCHAR(40) CHARACTER SET utf8,
			IN `@apPaterno` VARCHAR(40) CHARACTER SET utf8,
			IN `@apMaterno` VARCHAR(40) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		-- START TRANSACTION;
			UPDATE operator
			SET firstName=`@nombre`, 
				lastName=`@apPaterno`, 
				mothersLastName=`@apMaterno`        
			WHERE id=`@codigoPersona`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@codigoPersona`, 2, CURRENT_TIMESTAMP);
		-- COMMIT;
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;	
		let codigo = request.body.codigo;
		let n_ = request.body.nombre;
		let ap_ = request.body.paterno;
		let am_ = request.body.materno;
		let firma = request.body.firma;
		
		await dataProvider.query("CALL resetLabelsOnOperator(?, ?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			n_,
			ap_,
			am_,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : error }); // (error.sqlMessage + " - " + error.sql)
			else {
				if( result[0] )
					response.json( result[0] );
				else
					response.json({ 'error' : "---" });
			}
		});
		dataProvider.release();
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtOperator.patch('/identificacion', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS resetIdOperator;
		DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS resetIdOperator (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,

			IN `@idOperator` INTEGER UNSIGNED,    
			IN `@signalDocument` CHAR(1) CHARACTER SET utf8,
			IN `@numberDoc` VARCHAR(14) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			UPDATE 
				operator 
			SET 
				docType = `@signalDocument`, 
				idDocument = `@numberDoc`
			WHERE 
				id = `@idOperator`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, 2, `@idOperator`, 2, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;	
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let tipo = request.body.tipo;
		let documento = request.body.documento;
		await dataProvider.query("CALL resetIdOperator(?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			tipo,
			documento,
			_ID_
		]
		,(error, result, fields) => { 
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

module.exports = rtOperator;