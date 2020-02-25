/**
 * @file server.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019/2020
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

const express = require('express'), application = express();
const cors = require('cors');
const SERVER_PORT = process.env.PORT || 8088;

/* CORS enabled */
application.use( cors() );
application.use( (request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

/* JSON communication enabled */
application.use( express.urlencoded({ extended : false }) );
application.use( express.json() );

/* API(s) Section */
application.use('/api/bitacora', require('./src/controller/00.logger.js'));
application.use('/api/usuario', require('./src/controller/01.login.js'));
application.use('/api/entidad', require('./src/controller/02.customer.js'));
application.use('/api/ruteo', require('./src/controller/03.stdRoute.js'));
application.use('/api/personal/', require('./src/controller/04.operator.js'));
application.use('/api/tipoDocumento/', require('./src/controller/05.dictDocument.js'));
application.use('/api/unidadColectora/', require('./src/controller/06.vehicle.js'));
application.use('/api/dispositivoGPS/', require('./src/controller/07.device.js'));
application.use('/api/horario', require('./src/controller/08.schedule.js'));

/*
application.use('/api/operacion', require('./src/controller/operaciones.js'));
application.use('/api/trayecto', require('./src/controller/trayecto.js'));
*/

// Take ON server on (8088) port
application.listen(SERVER_PORT, () => { console.log('Servidor escuchando en el Puerto : ' + SERVER_PORT); });