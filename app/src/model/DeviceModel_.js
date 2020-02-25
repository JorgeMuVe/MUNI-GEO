import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getTotalDevices () { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/dispositivoGPS/total') 
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}

export function getListOfDevicesByPage( offset, numberOfItems, idClient ) { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/dispositivoGPS/paginado/' + offset + '/' + numberOfItems + '/' + idClient)
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}

export function addDevice_( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/dispositivoGPS/', {
            method : 'POST', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}

export function changeStatusOnDevice( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/dispositivoGPS/disponibilidad/', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function changeDataOnDevice( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/dispositivoGPS/denominacion/referencias', {
            method : 'PATCH', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}
