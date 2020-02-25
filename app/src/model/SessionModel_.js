import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function tryCredentialsTologin ( data ) {
	/*
	curl -X POST -H "Content-Type:application/json" -d '{"usuario":"168ad2dbf16bce474c870deb2d7cdf1a69e36917","clave":"e4809c3513a7b3b95f6bb67cc4c1a85c82dd3f53"}'  http://localhost:8088/api/usuario/login
	*/
    return new Promise((resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/usuario/validar', {
            method : 'POST', body: JSON.stringify( data ),
            headers: new Headers({ 'Accept': 'application/json', 'Content-type':'application/json' }) })
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); }); // .catch(err => Promise.reject('Authentication Failed!'));
    });   
}

export function isAuthenticated(){
    return window.sessionStorage.getItem('x-access-token') && window.sessionStorage.getItem('x-access-token-expiration') > Date.now()
}