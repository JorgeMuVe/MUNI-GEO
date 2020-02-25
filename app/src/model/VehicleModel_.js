import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getTotalVehicles () { 
	return new Promise((resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/unidadColectora/total') 
			.then( r => r.json() )
			.then( d => { resolve(d); })
		.catch((e) => { reject(e); });
	});
}

export function getListOfVehiclesByPage( offset, numberOfItems, idClient ) { 
	return new Promise((resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/unidadColectora/paginado/' + offset + '/' + numberOfItems + '/' + idClient)
			.then( r => r.json() )
			.then( d => { resolve(d); })
		.catch((e) => { reject(e); });
	});
}

export function addVehicle_( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/unidadColectora/', {
			method : 'POST', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function changeStatusOnVehicle( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/unidadColectora/disponibilidad/', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function changeDataOnVechicle( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/unidadColectora/denominacion/placa', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}