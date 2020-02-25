/**
 * @file 03.stdRoute.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtRoute = require('express').Router(),
	  dataProvider = require('../db-conector.js'),
	  _ID_ = 2;

/*
DROP TABLE IF EXISTS stdRoute;
DELIMITER //
	CREATE TABLE IF NOT EXISTS stdRoute (
		id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		idClient SMALLINT UNSIGNED NOT NULL, -- FK
		internalRouteCode VARCHAR(12) CHARACTER SET utf8 NULL, 
		labelRoute VARCHAR(120) CHARACTER SET utf8 NOT NULL,
		dateValidFrom CHAR(10) CHARACTER SET utf8 NOT NULL,
		isEnabled BINARY(1) NOT NULL DEFAULT 1
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 //
DELIMITER ;

ALTER TABLE stdRoute ADD CONSTRAINT FOREIGN KEY (idClient) REFERENCES customer(id);
ALTER TABLE stdRoute AUTO_INCREMENT=9205;

-- BEGIN of DATA
	INSERT INTO stdRoute VALUES(9205, 60362, 'R-01-Aa1','Collasuyo - Ucchullo (Lunes)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9206, 60362, 'R-01-Aa2','Ccollasuyo – Ucchullo (Mi, V)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9207, 60362, 'R-02-Ab1','Lucrepata - Zaguan del Cielo – Tahuantinsuyo (Martes)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9208, 60362, 'R-02-Ab2','Lucrepata - Zaguan del Cielo – Tahuantinsuyo (J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9209, 60362, 'R-03-Aa', 'Av Ejército - Av Pardo (L, Mi, V)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9210, 60362, 'R-04-Ab', 'Av Ejército - Carmen Quicllo (M, J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9211, 60362, 'R-05-Aa1','Villa San Blas - Circunvalación - 1ro de Mayo (L, V)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9212, 60362, 'R-06-Aa2','Villa San Blas - Circunvalación – Tambillo (Miércoles)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9213, 60362, 'R-07-Ab1','Circunvalación - José Escobedo – Alto Los Incas (Martes)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9214, 60362, 'R-07-Ab2','Circunvalación - José Escobedo – Alto Los Incas (J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9215, 60362, 'R-08-Aa1','Pucyupata - 5 de Abril – Mirador San Benito (Lunes)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9216, 60362, 'R-08-Aa2','Pucyupata - 5 de Abril - Villa Maria (Mi, V)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9217, 60362, 'R-09-Ab', 'Pueblo Libre - San Isidro (M, J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9218, 60362, 'R-10-Aa', 'Backus – Hospital Regional – UNSAAC (L, Mi, V)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9219, 60362, 'R-10-Ab1','Backus – Hospital Regional – UNSAAC (Martes)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9220, 60362, 'R-10-Ab2','Backus – Hospital Regional – UNSAAC (J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9221, 60362, 'R-11-Ac1','Av La Cultura - Camino Real – Av Argentina (L, M, Mi, V, D)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9222, 60362, 'R-11-Ac2','Av La Cultura – Camino Real – Bombonera (J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9223, 60362, 'R-12-Aa1','Arcopata – Panamericana (Lunes)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9224, 60362, 'R-12-Aa2','Arcopata - Panamericana – Bosque (Mi, V, D)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9225, 60362, 'R-13-Ab', 'Arcopata - Panamericana – Bosque (M, J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9226, 60362, 'R-14-Aa', 'Av Pardo - San Blas - Sipas Pujio (L, Mi, V)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9227, 60362, 'R-15-Ab', 'San Blas – Qollacalle (M, J, S)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9228, 60362, 'R-16-Aa', 'Saphy – Arcopata (L, Mi, V)', '2019-01-01', HEX(1));
	INSERT INTO stdRoute VALUES(9229, 60362, 'R-17-Ab', 'Saphy – Umanchata (M, J, S)', '2019-01-01', HEX(1));
	-- INSERT INTO stdRoute VALUES( 1, '18', '',HEX(1)); -- No existe ???

-- END of DATA
*/

rtRoute.get('/componente/:entidad', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstRoutes;
		DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstRoutes (
			IN `@clientID` INTEGER UNSIGNED 
		) BEGIN
			SELECT 
				R.id AS codigoRuteo,
				R.internalRouteCode AS codigo,
				R.labelRoute AS denominacionRuteo 
			FROM 
				stdRoute R
			WHERE 
				R.idClient = `@clientID`; -- INNER JOIN clientLabelRoute E ON E.id=R.id
		END $$
	DELIMITER ;
	
	-- CALL lstRoutes(60362);
	*/
	try {  
		await dataProvider.query("CALL lstRoutes(?)",
		[
			parseInt(request.params.entidad)
		], 
		(error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
			else {
				if (result[0])
					response.json( result[0] );  // Enviar result de consulta en JSON 
				else
					response.json({ error : "vacío" }); // Enviar error en JSON
			}
		});
		dataProvider.release(); //Liberar la conexión usada del POOL de conexiones 
	} catch(errorException) {
		response.json({ error : errorException.code });
	}
});

rtRoute.get('/paginado/:inicio/:numeroRutas/:entidad', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstRoutesByPage;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstRoutesByPage (
			IN `@startOffset` INTEGER UNSIGNED,
			IN `@numberItems` INTEGER UNSIGNED,
			IN `@clientID` SMALLINT UNSIGNED
		) BEGIN
			SELECT 
				R.id AS codigoRuteo, 
				R.internalRouteCode AS codigo, 
				R.labelRoute AS denominacionRuteo,
				R.dateValidFrom AS fechaEdicion,
				DATE_FORMAT(DATE(R.dateValidFrom), "%d/%m/%Y") AS fechaDespliegue,
				CAST(R.isEnabled AS INTEGER) AS habilitado
			FROM stdRoute R
			WHERE R.idClient = `@clientID`
			ORDER BY R.id DESC
			LIMIT `@startOffset`, `@numberItems`;
		END $$
	DELIMITER ;

	-- CALL lstRoutesByPage(0, 10, 60362);
	*/
	try {
		await dataProvider.query("CALL lstRoutesByPage(?, ?, ?)", 
		[
			parseInt(request.params.inicio),
			parseInt(request.params.numeroRutas),
			parseInt(request.params.entidad)
		], 
		(error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) });
			else {
				if (result[0])
					response.json( result[0] ); 
				else
					response.json({ error : "vacio" });
			}
		});
		dataProvider.release();  
	} catch(errorException) {
		response.json({ error : errorException.code });
	}
});

rtRoute.get('/total', async (request, response) => {
	try {  
		await dataProvider.query("SELECT count(*) AS total FROM stdRoute;", 
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

rtRoute.post('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS appendStdRoute;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS appendStdRoute (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,  
			IN `@codeRoute` VARCHAR(120) CHARACTER SET utf8, 
			IN `@nameRoute` VARCHAR(120) CHARACTER SET utf8, 
			IN `@dateVigence` CHAR(10) CHARACTER SET utf8, 
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		-- START TRANSACTION;
			INSERT INTO stdRoute VALUES(NULL, `@clientID`, `@codeRoute`, `@nameRoute`, `@dateVigence`, HEX(1));
			SET @temporalId = LAST_INSERT_ID();
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, @temporalId, 0, CURRENT_TIMESTAMP);
		-- COMMIT;
		END //
	DELIMITER ;

	-- IN `@companyID` SMALLINT UNSIGNED,
	CALL appendStdRoute(60362, '017fe9af4f3c11ea9ebc208984f8714c', 'R-02-Ab', 'Item de prueba', '2020-02-16', 2);
	*/
	try {
		// console.log( request.body );

		let cliente = request.body.cliente;
		let codificacion = request.body.codificacion;
		let denominacion = request.body.denominacion;
		let fechaInicio = request.body.fechaInicio;
		let firma = request.body.firma;

		await dataProvider.query("CALL appendStdRoute(?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			codificacion,
			denominacion,
			fechaInicio,
			_ID_
		], 
		(error, result, fields) => { 
			if (error) {
				response.json({ 'error' : error });
			} else {
				// console.log( result );
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

rtRoute.patch('/disponibilidad/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS setEnabledStatusPerRoute;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS setEnabledStatusPerRoute (
			IN `@clientID` SMALLINT UNSIGNED,			
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@routeID` INTEGER UNSIGNED,
			IN `@status` TINYINT(1) UNSIGNED,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
		-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		-- START TRANSACTION;
			IF `@status` = 0 THEN 
				UPDATE stdRoute SET isEnabled=HEX(0) WHERE id=`@routeID`;
			ELSE
				UPDATE stdRoute SET isEnabled=HEX(1) WHERE id=`@routeID`;
			END IF;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@routeID`, 2, CURRENT_TIMESTAMP);
		-- COMMIT;
		END //
	DELIMITER ;

	-- CALL setEnabledStatusPerRoute(60362, 'd95673944f4311ea9ebc208984f8714c', 9207, 0, 2);
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let estado = request.body.estado;
		await dataProvider.query("CALL setEnabledStatusPerRoute(?, ?, ?, ?, ?)", 
		[
			cliente,
			firma,
			parseInt(codigo),
			parseInt(estado),
			_ID_
		], (error, result, fields) => { 
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
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtRoute.patch('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS updateDataFromRoute;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS updateDataFromRoute (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@idRoute` INTEGER UNSIGNED,
			IN `@codeRoute` VARCHAR(11) CHARACTER SET utf8,
			IN `@nameRoute` VARCHAR(120) CHARACTER SET utf8,
			IN `@dateRoute` CHAR(10) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED  
		) BEGIN
		-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		-- START TRANSACTION;
			UPDATE 
				stdRoute 
			SET 
				internalRouteCode=`@codeRoute`,
				labelRoute=`@nameRoute`,
				dateValidFrom=`@dateRoute` 
			WHERE
				id=`@idRoute`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@idRoute`, 2, CURRENT_TIMESTAMP);		
		-- COMMIT;
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let codigo = request.body.codigo;
		let codificacion = request.body.codificacion;
		let nombre = request.body.nombre;
		let fecha = request.body.fecha;	
		let firma = request.body.firma;

		await dataProvider.query("CALL updateDataFromRoute(?, ?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			codificacion,
			nombre,
			fecha,
			_ID_
		], (error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
			else {
				if (result[0])
					response.json( result[0] );  // Enviar result de consulta en JSON 
				else
					response.json({ error : "vacio" }); // Enviar error en JSON
			}
		});
		dataProvider.release(); //Liberar la conexión usada del POOL de conexiones 
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

/*
rtRoute.patch('/codigoInstitucion', async (request, response) => {
	/ *
	DROP PROCEDURE IF EXISTS modificarCodificacionRuteo;
	DELIMITER //
	CREATE PROCEDURE IF NOT EXISTS modificarCodificacionRuteo (
		IN `@codigoRuteo` INTEGER UNSIGNED,
		IN `@codigo1` INTEGER UNSIGNED,
		IN `@codigo2` CHAR(1) CHARACTER SET utf8,
		IN `@codigo3` CHAR(1) CHARACTER SET utf8,
		IN `@codigo4` TINYINT(1) UNSIGNED,
		IN `@firma` CHAR(32) CHARACTER SET utf8
	) BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
	START TRANSACTION;
		UPDATE etiquetaInstitucionalDeRuteo SET codigoRutaNumerico=CAST(`@codigo1` AS CHAR), codigoRutaTextual=CONCAT(`@codigo2`, `@codigo3`), codigoRutaNumeral=`@codigo4` WHERE codigoRuteo=`@codigoRuteo`;
		INSERT INTO bitacora VALUES (`@firma`, 2, `@codigoRuteo`, 2, CURRENT_TIMESTAMP); -- Ruteo 1
	COMMIT;
	END;
	//
	DELIMITER ;
	* /
	try {
		let codigo = request.body.codigo;
		let c1 = request.body.c1;
		let c2 = request.body.c2;
		let c3 = request.body.c3;
		let c4 = request.body.c4;
		let firma = request.body.firma;
		await dataProvider.query("CALL modificarCodificacionRuteo(?, ?, ?, ?, ?, ?)", 
		[
			parseInt(codigo),
			c1,
			c2,
			c3,
			c4,
			firma
		], (error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
			else {
				if (result[0])
					response.json( result[0] );  // Enviar result de consulta en JSON 
				else
					response.json({ error : "vacio" }); // Enviar error en JSON
			}
		});
		dataProvider.release(); //Liberar la conexión usada del POOL de conexiones 
	} catch(errorException) {
		response.json({ error : errorException.code });
	}
});

rtRoute.get('/:mes/:agno', async (request, response) => {
	/ *
	DROP PROCEDURE IF EXISTS listarRuteosPorPeriodo;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS listarRuteosPorPeriodo (
			IN `@mes` TINYINT(1) UNSIGNED,
			IN `@agno` CHAR(4) CHARACTER SET utf8
		) BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		START TRANSACTION;
			SELECT R.codigoRuteo, CONCAT('R',E.codigoRutaNumerico, '-', codigoRutaTextual, IFNULL(codigoRutaNumeral,'')) AS codigo, R.denominacionRuteo 
			FROM ruteo R INNER JOIN etiquetaInstitucionalDeRuteo E ON E.codigoRuteo=R.codigoRuteo
			WHERE R.mes=`@mes` AND R.agno=`@agno`;
		COMMIT;
		END $$
	DELIMITER ;
	* /
	try {
		await dataProvider.query("CALL listarRuteosPorPeriodo(?, ?)", 
		[
			request.params.mes,
			request.params.agno
		], (error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) });
			else {
				if (result[0])
					response.json( result[0] );
				else
					response.json({ error : "vacio" });
			}
		});
		dataProvider.release();
	} catch(error) {
		response.json({ error : error.code });
	}
});

/*
 /
rtRoute.delete('/codigoInstitucion', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS removerCodificacionRuteo;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS removerCodificacionRuteo (
			IN `@codigoRuteo` INTEGER UNSIGNED,
			IN `@firma` CHAR(32) CHARACTER SET utf8 
		) BEGIN
		-- DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
		-- START TRANSACTION;
			DELETE FROM etiquetaInstitucionalDeRuteo WHERE codigoRuteo=`@codigoRuteo`;
			INSERT INTO bitacora VALUES (`@firma`, 2, `@codigoRuteo`, 3, CURRENT_TIMESTAMP);
		-- COMMIT;
		END //
	DELIMITER ;
	* /
	try {
		let codigo = request.body.codigo;
		let firma = request.body.firma; 
		await dataProvider.query("CALL removerCodificacionRuteo(?, ?)", 
		[
			parseInt(codigo),
			firma
		], (error, result) => { 
			if (error)
				response.json({ 'error' : error }); // Enviar error en JSON (error.sqlMessage + " - " + error.sql)
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
*/

module.exports = rtRoute;
/**
 * @description gestionar el ruteo (GET) "/api/ruteo/componente/mes/agno a la petición Web de la ruta gestionada
 * @param {object} response -- Gestor del Ruteo --"
 * @since 0.0.1 
 * @param {object} request Parámetros adjuniegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 -- CONCAT('R',E.numerical, '-', textual, IFNULL(numerical2,'')) AS codigo, 

DROP PROCEDURE IF EXISTS `getRouteById`;;
CREATE PROCEDURE `getRouteById`(IN `@idRoute` CHAR(3) CHARACTER SET utf8 )
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
	START TRANSACTION;
	SELECT C.numerical, C.textual, C.numerical2, R.label, R.isEnabled, R.id, C.id 
	FROM clientLabelRoute C INNER JOIN garbageRecoveryRoute R ON R.idClient = C.id
	WHERE R.id LIKE `@idRoute`;
	COMMIT;
END;;
IN `@codigo1` INTEGER UNSIGNED,
IN `@codigo2` CHAR(1) CHARACTER SET utf8,
IN `@codigo3` CHAR(1) CHARACTER SET utf8,
IN `@codigo4` TINYINT(1) UNSIGNED,

-- IN `@mes` TINYINT(1) UNSIGNED, -- IN `@agno` CHAR(4) CHARACTER SET utf8,
-- (denominacionRuteo, mes, agno) `@mes`, `@agno`
*/