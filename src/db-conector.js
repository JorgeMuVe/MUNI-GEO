/**
 * @file conexiondb.js
 * @description Crea una conexión a la base de datos
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */

const mysql = require('mysql');
const promesas = require('util');
const { baseDeDatos } = require('./db-credentials.js');
const db = mysql.createPool( baseDeDatos );

db.getConnection( (errorConexion, conexion) => {
    if (errorConexion){
        console.error('Error al Conectar con la Base de Datos...');
        if (errorConexion.code === 'PROTOCOL_CONNECTION_LOST') { console.error('Conexión con Base de Datos Terminada.'); }
        if (errorConexion.code === 'ER_CON_COUNT_ERROR'){ console.error('Base de Datos tiene una o mas Conexiones.'); }
        if (errorConexion.code === 'ECONNREFUSED'){ console.error('Solicitud de Conexión Rechazada.'); }
        if (errorConexion.code === 'ER_BAD_DB_ERROR'){ console.error('No existe Base de Datos.'); }
    }
    if (conexion) {
        conexion.release();
        console.log('Base de Datos Conectada!!!...');
    }
    return;
});

db.query = promesas.promisify(db.query); 
module.exports = db; 