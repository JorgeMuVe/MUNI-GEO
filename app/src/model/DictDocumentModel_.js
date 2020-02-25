import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getDocumentClasification () { 
    return new Promise((resolve, reject) => {
        fetch ( API_DATAPROVIDER + '/api/tipoDocumento/') 
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}