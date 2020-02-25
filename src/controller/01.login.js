/**
 * @file login.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtLogin = require('express').Router(),
	  dataProvider = require('../db-conector.js'),
	  _ID_ = 1;

const jwt = require("jsonwebtoken");
process.env.SECRET_KEY = 'CUALQUIER-COSA'; 

/*
DROP TABLE IF EXISTS loginAccount;
DELIMITER //
	CREATE TABLE IF NOT EXISTS loginAccount ( 
		idClient SMALLINT UNSIGNED NOT NULL,
		email CHAR(40) CHARACTER SET utf8 NOT NULL,
		password CHAR(40) CHARACTER SET utf8 NOT NULL,
		label VARCHAR(120) CHARACTER SET utf8 NOT NULL, -- fullName
		eSign CHAR(32) CHARACTER SET utf8 NOT NULL UNIQUE KEY,
		role SMALLINT UNSIGNED NOT NULL DEFAULT 0, -- sin roles por defecto?? 
		isEnabled BINARY(1) NOT NULL DEFAULT 1
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 //
DELIMITER ;

-- ALTER TABLE loginAccount ADD CONSTRAINT FOREIGN KEY (idClient) REFERENCES customer(id);

INSERT INTO loginAccount SET idClient=60361,email=SHA1('sysadmin@worldconnect.com'),password=SHA1('login'),label='Administrador Principal Del Sistema',role=1,eSign=REPLACE(UUID(),'-','');
INSERT INTO loginAccount SET idClient=60362,email=SHA1('admin@cusco.gob.pe'),password=SHA1('123456'), label='Administrador/Municipio Provincial Cusco', role=2, eSign=REPLACE(UUID(), '-', '');
INSERT INTO loginAccount SET idClient=60362, email=SHA1('operador@cusco.gob.pe'),password=SHA1('admin'),label='Operador Plataforma',role=4,eSign=REPLACE(UUID(), '-', '');
*/

rtLogin.post('/validar', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS checkValidUser;
	DELIMITER $$
	CREATE PROCEDURE IF NOT EXISTS checkValidUser (
		IN `@cuentaUsuario` CHAR(40) CHARACTER SET utf8,
		IN `@contrasegna` CHAR(40) CHARACTER SET utf8
	) BEGIN
	-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
	-- START TRANSACTION;
		SET @numberAccounts = 0;
		IF EXISTS(SELECT * FROM loginAccount WHERE email=`@cuentaUsuario` AND password=`@contrasegna`) THEN
			SELECT count(*) INTO @numberAccounts FROM loginAccount WHERE email=`@cuentaUsuario` AND password=`@contrasegna`;		
			IF (@numberAccounts = 1) THEN 
				SELECT
					a.idClient AS idClient,
					a.label AS label,
					a.role AS role,
					CONCAT(c.labelCustomer,' - ', IFNULL(c.labelOffice, '')) AS clientLabel,
					a.eSign AS sign
				FROM 
					loginAccount a 
				INNER JOIN 
					customer c ON a.idClient = c.id
				WHERE 
					a.email=`@cuentaUsuario` AND a.password=`@contrasegna`;
			ELSE 
				SELECT "0" AS codError;
			END IF;
		ELSE 
			SELECT "0" AS codError;
		END IF;
	-- COMMIT;
	END $$
	DELIMITER ;

	CALL checkValidUser('168ad2dbf16bce474c870deb2d7cdf1a69e36917', '2736fab291f04e69b62d490c3c09361f5b82461a');
	*/
	try {   
		const { usuario, clave } = request.body;
		if (clave.length > 40) { 
			response.json({ "error" : 'parámetro(s) INADECUADO(s)' }) 
		} else { 
			await dataProvider.query('CALL checkValidUser(?, ?)',
			[ 
				usuario, 
				clave 
			],
			(error, result, fields) => {
			if (error) { 
				console.log( error ); console.log( fields );
				response.json({ 'error' : error });
			} else {
				if (result[0][0].codError !== '0' ) {
					const sessionData = {
						id : result[0][0]['id'],
						idClient : result[0][0]['idClient'],
						label : result[0][0]["label"],
						role : result[0][0]["role"],
						labelClient : result[0][0]["clientLabel"],
						eSignSession : result[0][0]["sign"],
					}; // const sessionData = { hello : "\x53\x61\x79\x48\x65\x6C\x6C\x6F\u0020" };
					let token = jwt.sign(sessionData, process.env.SECRET_KEY);
					response.json({ tokenSession : token });
				} else {
					response.json({ 'error' : "No existe Usuario" });
				}
			}
			});
			dataProvider.release();
		}
	} catch (errorException) { 
		response.json({ 'error' : errorException.code }) 
	}
});

rtLogin.post('/registrar/ingreso', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS registerSessionStart;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS registerSessionStart (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(40) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		START TRANSACTION;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, 4, CURRENT_TIMESTAMP); -- 4 == LOGIN
		COMMIT;
		END $$
	DELIMITER ;

	-- CALL registerSessionStart(1, '017fe9af4f3c11ea9ebc208984f8714c');
	*/
	try {
		await dataProvider.query('CALL registerSessionStart(?, ?)', 
		[
			request.body.firma,
			parseInt(request.body.entidad)
		], 
		(error, result, fields) => {
			if (error) {
				console.log(error); // error.sqlMessage
                response.json({ 'error' : error });  // error.sql
            } else {
                if (resultado[0])
                    response.json( resultado[0] );
                else
                    response.json({ 'error' : "vacío" });
            }
		});
		dataProvider.release();
	} catch (errorException) { 
		response.json({ 'error' : errorException.code }) 
	}
});

rtLogin.post('/registrar/salida', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS registerSessionFinish;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS registerSessionFinish (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(40) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
			START TRANSACTION;
				INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, 5, CURRENT_TIMESTAMP); -- 5 == LOGOUT
			COMMIT;
		END $$
	DELIMITER ;

	-- CALL registerSessionFinish(1, '017fe9af4f3c11ea9ebc208984f8714c');
	*/
	try {
		await dataProvider.query('CALL registerSessionFinish(?, ?)', 
		[
			request.body.firma,
			parseInt(request.body.entidad),
			_ID_
		], 
		(error, result, fields) => {
			if (error) {
				console.log(error);
                response.json({ 'error' : error });
            } else {
                if (result[0])
                    response.json( result[0] );
                else
                    response.json({ 'error' : "vacío" });
            }
		});
		dataProvider.release();
	} catch (errorException) { 
		response.json({ 'error' : errorException.code }) 
	}
});

module.exports = rtLogin;