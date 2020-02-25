import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getTotalGarbageRoutes () { 
	return new Promise((resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/ruteo/total') 
			.then( r => r.json() )
			.then( d => { resolve(d); })
		.catch((e) => { reject(e); });
	});
}

// FOR COMPONENT
export function getGarbageRoutesByClient ( idClient )  { 
	return new Promise((resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/ruteo/componente/' + idClient) 
			.then( r => r.json() )
			.then( d => { resolve(d); })
		.catch((e) => { reject(e); });
	});
}

export function getListOfGarbageRoutesByPage( offset, numberOfItems, idClient ) { 
	return new Promise((resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/ruteo/paginado/' + offset + '/' + numberOfItems + '/' + idClient)
			.then( r => r.json() )
			.then( d => { resolve(d); })
		.catch((e) => { reject(e); });
	});
}

export function addGarbageRoute( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/ruteo/', {
			method : 'POST', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function changeStatusOnRoute( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/ruteo/disponibilidad/', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function changeDataOnRoute( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/ruteo/', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}