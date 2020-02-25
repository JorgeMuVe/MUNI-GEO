/**
 * @file 08.schedule.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtSchedule = require('express').Router(),
	  dataProvider = require('../db-conector.js'),
	  _ID_ = 8;

/*
DROP TABLE IF EXISTS schedulePerArea; -- detail of Route
DELIMITER //
	CREATE TABLE IF NOT EXISTS schedulePerArea (
		id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		idRoute INTEGER UNSIGNED NOT NULL, -- FK
		areasLabel VARCHAR(120) CHARACTER SET utf8 NOT NULL,
		startTime CHAR(5) CHARACTER SET utf8 NOT NULL,
		intervalTime INTEGER UNSIGNED NOT NULL DEFAULT 0,
		attentionDays TINYINT(1) UNSIGNED NOT NULL CHECK (attentionDays <= 127),
		isEnabled BINARY(1) NOT NULL DEFAULT 1
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 //
DELIMITER ;

-- ALTER TABLE schedulePerArea ADD CONSTRAINT FOREIGN KEY (idRoute) REFERENCES garbageRecoveryRoute(id);

-- BEGIN of DATA
	-- R 01 Aa1
	INSERT INTO schedulePerArea VALUES (NULL, 9205, 'miravalle', '05:30', 90, 64, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9205, 'cristo pobre', '06:40', 40, 64, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9205, 'covipol', '07:10', 50, 64, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9205, 'ccollasuyo', '08:00', 60, 64, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9205, 'cruz pata', '06:00', 40, 64, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9205, 'ucchullo grande', '07:20', 40, 64, HEX(1));

	-- R 01 Aa2
	INSERT INTO schedulePerArea VALUES (NULL, 9206, 'miravalle', '05:30', 70, 20, HEX(1)); -- parseInt('0010100', 2)
	INSERT INTO schedulePerArea VALUES (NULL, 9206, 'cristo pobre', '08:50', 30, 20, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9206, 'covipol', '07:00', 20, 20, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9206, 'ccollasuyo', '07:30', 30, 20, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9206, 'cruz pata', '08:10', 30, 20, HEX(1));
	INSERT INTO schedulePerArea VALUES (NULL, 9206, 'ucchullo grande', '09:20', 40, 20, HEX(1));
-- END of DATA
*/

rtSchedule.get('/componente/zona', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstUrbanAreas;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstUrbanAreas ( ) 
		BEGIN
			SELECT DISTINCT areasLabel AS bloqueUrbano FROM schedulePerArea; 
		END $$
	DELIMITER ;
	
	-- CALL lstUrbanAreas();
	*/
	try {  
		await dataProvider.query("CALL lstUrbanAreas()",
		(error, result, fields) => { 
			if (error)
				response.json({ error : error });
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

rtSchedule.get('/:id', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstSchedulePerRoute;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstSchedulePerRoute (
			IN `@id` INTEGER UNSIGNED
		) BEGIN
			SELECT 
				id AS codigoHorario, 
				areasLabel AS zonaAfectada, 
				startTime AS horaInicio, 
				SUBSTRING(DATE_ADD(CAST(startTime AS TIME), 
				INTERVAL intervalTime MINUTE), 1, 5) AS horaFin, 
				attentionDays AS atencionPorDias, 
				CAST(isEnabled AS INTEGER) AS habilitado
			FROM 
				schedulePerArea 
			WHERE 
				idRoute=`@id` AND HEX(UNHEX(isEnabled))='01' 
			ORDER BY startTime ASC; 
		END $$
	DELIMITER ;

	-- CALL lstSchedulePerRoute(60362);
	*/
	try {  
		await dataProvider.query("CALL lstSchedulePerRoute(?)", 
		[
			request.params.id
		],
		(error, result) => { 
			if (error)
				response.json({ error : error });
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

rtSchedule.patch('/disponibilidad/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS setEnabledStatusPerSchedule;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS setEnabledStatusPerSchedule (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@scheduleID` INTEGER UNSIGNED,
			IN `@status_` TINYINT(1) UNSIGNED,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			IF `@status_` = 0 THEN 
				UPDATE schedulePerArea 
				SET isEnabled=HEX(0) 
				WHERE id=`@scheduleID`;
			ELSE
				UPDATE schedulePerArea
				SET isEnabled=HEX(1) 
				WHERE id=`@scheduleID`;
			END IF;
			
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@scheduleID`, 2, CURRENT_TIMESTAMP);
		
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let estado = request.body.estado;
		await dataProvider.query("CALL setEnabledStatusPerSchedule(?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			parseInt(estado),
			_ID_
		]
		,(error, result, fields) => { 
			if (error)
				response.json({ 'error' : error });
			else {
				if (result[0])
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

rtSchedule.patch('/denominacion/bloqueUrbano', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS changeZoneOnSchedule;
		DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS changeZoneOnSchedule (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@scheduleID` INTEGER UNSIGNED,    
			IN `@zone` VARCHAR(120) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN 
			UPDATE 
				schedulePerArea
			SET 
				areasLabel = `@zone` 
			WHERE 
				id=`@scheduleID`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, @scheduleID, 2, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;  -- VARCHAR(120) CHARACTER SET utf8
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let zona = request.body.zona;
		await dataProvider.query("CALL changeZoneOnSchedule(?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			zona,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : error });
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

rtSchedule.patch('/denominacion/rangoTemporal', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS changeTimeOnSchedule;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS changeTimeOnSchedule (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@scheduleID` INTEGER UNSIGNED,		
			IN `@hour_` CHAR(5) CHARACTER SET utf8,
			IN `@interval_` CHAR(5) CHARACTER SET utf8,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN 
			SET @tmpInterval = TIME_TO_SEC(SUBTIME(`@interval_`, `@hour_`)) / 60;
			UPDATE 
				schedulePerArea 
			SET 
				startTime = `@hour_`, 
				intervalTime = CAST(@tmpInterval AS INTEGER) 
			WHERE 
				id=`@scheduleID`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@scheduleID`, 2, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let codigo = request.body.codigo;
		let hora = request.body.hora;
		let intervalo = request.body.intervalo;

		await dataProvider.query("CALL changeTimeOnSchedule(?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			hora,
			intervalo,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : error });
			else {
				if ( result[0] )
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

rtSchedule.patch('/denominacion/atencionDiaria', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS changeAttentionDaysOnSchedule;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS changeAttentionDaysOnSchedule (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@scheduleID` INTEGER UNSIGNED,
			IN `@dayz` INTEGER UNSIGNED,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN 
			UPDATE schedulePerArea 
			SET attentionDays=`@dayz` 
			WHERE id=`@scheduleID`;
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, `@scheduleID`, 2, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let codigo = request.body.codigo;
		let dias = request.body.dias;
		let firma = request.body.firma;

		await dataProvider.query("CALL changeAttentionDaysOnSchedule(?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(codigo),
			parseInt(dias),
			_ID_
		]
		,(error, result) => { 
			if (error)
				response.json({ 'error' : error }); // Enviar error en JSON
			else {
				if( result[0] )
					response.json( result[0] );  // Enviar result de consulta en JSON 
				else
					response.json({ 'error' : "vacío" }); // Enviar error en JSON
			}
		});
		dataProvider.release();
	} catch(errorException) {
		response.json({ 'error' : errorException.code });
	}
});

rtSchedule.post('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS addSchedulePerAreaItem;
	DELIMITER //
		CREATE PROCEDURE IF NOT EXISTS addSchedulePerAreaItem (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` CHAR(32) CHARACTER SET utf8,
			IN `@routeID` INTEGER UNSIGNED,
			IN `@zone` VARCHAR(120) CHARACTER SET utf8,
			IN `@timeSimplified` CHAR(5) CHARACTER SET utf8,
			IN `@interval_` CHAR(5) CHARACTER SET utf8, -- INTEGER UNSIGNED, -- IN `@days_` TINYINT(1) UNSIGNED,
			IN `@module` TINYINT(1) UNSIGNED
		) BEGIN
			SET @tmpInterval = TIME_TO_SEC(SUBTIME(`@interval_`, `@timeSimplified`)) / 60; 
			INSERT INTO schedulePerArea VALUES(NULL, `@routeID`, `@zone`, `@timeSimplified`, CAST(@tmpInterval AS INTEGER), 0, HEX(1)); -- `@days_`
			SET @temporalId = LAST_INSERT_ID();
			INSERT INTO logger VALUES (`@sign`, `@clientID`, `@module`, @temporalId, 0, CURRENT_TIMESTAMP);
		END //
	DELIMITER ;
	*/
	try {
		let cliente = request.body.cliente;
		let firma = request.body.firma;
		let ruta = request.body.ruta;
		let zona = request.body.zona;
		let hora = request.body.hora;
		let intervalo = request.body.intervalo;
		// let dias = request.body.dias;           

		await dataProvider.query("CALL addSchedulePerAreaItem(?, ?, ?, ?, ?, ?, ?)", 
		[
			parseInt(cliente),
			firma,
			parseInt(ruta),
			zona,
			hora,
			intervalo,
			_ID_
		],
		(error, result, fields) => { 
			if (error)
				response.json({ 'error' : (error.sqlMessage + " - " + error.sql) });
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

/*
rtSchedule.get('/paginado/:inicio/:numeroPersonas', async (request, response) => {
	/
	DROP PROCEDURE IF EXISTS listarbloqueUrbanoZonaPaginado;
	DELIMITER $$
	CREATE PROCEDURE IF NOT EXISTS listarbloqueUrbanoZonaPaginado (
		IN `@inicio` INTEGER UNSIGNED,
		IN `@numero` INTEGER UNSIGNED
	) BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
	START TRANSACTION;
		SELECT codigoUrbano, denominacionUrbana, CAST(habilitado AS INTEGER) as habilitado   
		FROM bloqueUrbanoZona
		ORDER BY codigoUrbano DESC
		LIMIT `@inicio`, `@numero` ;
	COMMIT;
	END;
	$$
	DELIMITER ;
	/
	try {  
		await dataProvider.query("CALL listarPersonalPaginado(?, ?)", 
		[
			request.params.inicio,
			request.params.numeroPersonas
		],
		(error, result) => { 
			if (error)
				response.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
			else {
				if(result[0])
					response.json( result[0] );  // Enviar result de consulta en JSON 
				else
					response.json({ error : "vacío" }); // Enviar error en JSON
			}
		});
		dataProvider.release(); //Liberar la conexión usada del POOL de conexiones 
	} catch(error) {
		response.json({ error : error.code });
	}
});
*/

module.exports = rtSchedule;
/*
-- Rutas definidas para un grupo de Bloques Urbanos (o en base a)
-- Bloque Urbano Atendido [FALTA] Para su ubicacion en MAPAS de TERCEROS
-- codigoEntidad INTEGER UNSIGNED NOT NULL, -- FK
-- codigoUrbano INTEGER UNSIGNED NOT NULL, -- FK

		-- DECLARE @tmpInterval;
		-- SELECT DATE(NOW()-INTERVAL 15 DAY);
		-- SELECT(DATE_SUB(NOW(), INTERVAL '15:0' MINUTE_SECOND));
		-- SELECT SUBTIME(`@intervalo`, `@hora`);
*/
