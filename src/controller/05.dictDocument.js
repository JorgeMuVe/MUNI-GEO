/**
 * @file tipoDocumento.js
 * @author { carrillog.luis[at]gmail[dot]com }
 * @date 2019
 * @copyright Luis.Carrillo.Gutiérrez__World.Connect.Perú
 */
 
'use strict';
const gestorRutaTipoDocumento = require('express').Router();
const _ID_ = 4;

/*

*/


gestorRutaTipoDocumento.get('/', async (solicitud, respuesta) => { 
    try {
        respuesta.json( [
            { "id":"0", "denominacion":"otros tipos de documentos" },
            { "id":"1", "denominacion":"documento nacional de identidad (dni)" },
            { "id":"4", "denominacion":"carnet de extranjería" },
            { "id":"6", "denominacion":"registro único de contribuyentes (ruc)" },
            { "id":"7", "denominacion":"pasaporte" },
            { "id":"a", "denominacion":"cédula diplomática de identidad" }
        ]);
    } catch(errorException) {
        respuesta.json({ error : errorException.code });
    }
});

module.exports = gestorRutaTipoDocumento;