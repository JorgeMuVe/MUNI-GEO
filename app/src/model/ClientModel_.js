import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getTotalClients () { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/entidad/total') 
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}

export function getListOfClientsByPage( offset, numberOfItems ) { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/entidad/paginado/' + offset + '/' + numberOfItems)
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}

export function getClientsToComponent() { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/entidad/' ) 
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}

export function setEnabledStatusPerClient( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/entidad/disponibilidad/', {
            method : 'PATCH', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) }) 
        .then( r => r.json() )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}

export function setupLabelsClient( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/entidad/', {
            method : 'PATCH', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) }) 
        .then( r => r.json() )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}

export function addNewClient( data ) {
    return new Promise( (resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/entidad/', {
            method : 'POST', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
        .then( r => r )
        .then( d => { resolve(d); })
        .catch((e)=>{ reject(e); });
    });
}