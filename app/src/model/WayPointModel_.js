import {API_DATAPROVIDER} from './DATAPROVIDER_SERVER.js';

export function getWayPointsByScheduleItem( idSchedule ) { 
    return new Promise((resolve, reject) =>{
        fetch ( API_DATAPROVIDER + '/api/trayecto/' + idSchedule )
            .then( r => r.json() )
            .then( d => { resolve(d); })
        .catch((e) => { reject(e); });
    });
}