import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getTotalOperatorsRegistered () { 
	return new Promise((resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/personal/total') 
			.then( r => r.json() )
			.then( d => { resolve(d); })
		.catch((e) => { reject(e); });
	});
}

export function getOperatorsByPage( offset, numberOfItems, idClient ) { 
	return new Promise((resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/personal/paginado/' + offset + '/' + numberOfItems + '/' + idClient)
			.then( r => r.json() )
			.then( d => { resolve(d); })
		.catch((e) => { reject(e); });
	});
}

export function changeStatusFromOperator( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/personal/disponibilidad/', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function appendNewOperator( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/personal/', {
			method : 'POST', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function updateOperatorLabels_( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/personal/denominacion/', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}

export function updateOperatorDoc_( data ) {
	return new Promise( (resolve, reject) => {
		fetch ( API_DATAPROVIDER + '/api/personal/identificacion/', {
			method : 'PATCH', body: JSON.stringify( data ),
			headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
		.then( r => r )
		.then( d => { resolve(d); })
		.catch((e)=>{ reject(e); });
	});
}