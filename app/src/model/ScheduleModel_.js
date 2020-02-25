import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getScheduleByGarbageRoute( idRoute ) { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/horario/' + idRoute )
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}

export function addSchedule_( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/horario/', {
            method : 'POST', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}

export function changeStatusOnSchedule( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/horario/disponibilidad/', {
            method : 'PATCH', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}

export function changeZoneNameOnSchedule( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/horario/denominacion/bloqueUrbano/', {
            method : 'PATCH', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}

export function changeTimeIntervalOnSchedule( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/horario/denominacion/rangoTemporal/', {
            method : 'PATCH', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}

export function changeDailyServiceOnSchedule( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/horario/denominacion/atencionDiaria/', {
            method : 'PATCH', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}
