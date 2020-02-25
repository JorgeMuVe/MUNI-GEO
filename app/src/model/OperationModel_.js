import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getOperationsPointsByClient( idClient ) { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/operacion/componente/puntos/' + idClient )
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}

export function getOperationsLinesByClient( idClient ) { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/operacion/componente/trayectos/' + idClient )
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}