/**
 * @file logger.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

'use strict';
const rtLogger = require('express').Router(), 
	  dataProvider = require('../db-conector.js'), 
	  _ID_ = 0;

/*
DROP DATABASE IF EXISTS `GerenciaAmbiente`;
CREATE DATABASE IF NOT EXISTS `GerenciaAmbiente` COLLATE 'utf8_unicode_ci';

DROP TABLE IF EXISTS logger;
DELIMITER //
	CREATE TABLE IF NOT EXISTS logger (
		eSign CHAR(32) CHARACTER SET latin1 NOT NULL,
		idClient SMALLINT UNSIGNED NOT NULL,
		performedAt TINYINT(1) UNSIGNED NOT NULL,
		id VARCHAR(40) CHARACTER SET latin1 NOT NULL,
		event TINYINT(1) UNSIGNED NOT NULL,
		timeEvent TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	) ENGINE=MyISAM DEFAULT CHARSET=latin1 //
DELIMITER ;
*/

rtLogger.get('/', async (request, response) => {
	/*
	DROP PROCEDURE IF EXISTS lstActivitiesPerAccount;
	DELIMITER $$
		CREATE PROCEDURE IF NOT EXISTS lstActivitiesPerAccount (
			IN `@clientID` SMALLINT UNSIGNED,
			IN `@sign` INTEGER UNSIGNED,	
			IN `@fromDate` CHAR(10) CHARACTER SET utf8,
			IN `@toDate` CHAR(10) CHARACTER SET utf8
		) BEGIN
			SELECT
				L.performedAt AS moduloAfectado,
				L.id AS registroAfectado, 
				L.event AS operacion,
				L.timeEvent AS fechaHoraEvento
			FROM
				logger L
			WHERE 
				L.idClient = `@clientID` AND 
				(DATE(L.timeEvent) BETWEEN `@fromDate` AND `@toDate`)
				AND L.eSign IN (SELECT eSign FROM loginAccount E WHERE E.eSign=`@sign`) 
			ORDER BY L.timeEvent DESC;
		END $$
	DELIMITER ;
	*/
	try {
		await dataProvider.query("CALL lstActivitiesPerAccount(?, ?, ?, ?)", 
		[
			parseInt(request.body.cliente),
			parseInt(request.body.usuario),
			request.body.fechaInicio,
			request.body.fechaFinal 
		], 
		(error, result, fields) => { 
			if (error) {
				console.log( error );
				response.json( { 'error' : error } ); 
			} else {
				//console.log(result[0].length); // response.json( result );
				if (result[0].length !== 0) // { "error" : error,  "errorCode" : 1, "data" : [] } );
					response.json( result[0] ); // "errorCode" : 0, "data" : result[0] );
				else
					response.json( { "error" : 'vacío', "errorCode" : -1} );
			}
		});
		dataProvider.release();
	} catch (errorException) {
		response.json({ 'error' : errorException.code });
	}
});

module.exports = rtLogger;