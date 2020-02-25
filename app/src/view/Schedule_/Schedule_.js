import React from 'react';
import GlobalHeader from '../../component/GlobalHeader.js';
import ModulesTitle from '../../component/ModulesTitle.js';
import BlackBackgroundModal from '../../component/BlackBackgroundModal.js';

import { getClientsToComponent } from '../../model/ClientModel_.js';
import { getGarbageRoutesByClient } from '../../model/RouteModel_.js';
import { getScheduleByGarbageRoute, addSchedule_, changeStatusOnSchedule, changeZoneNameOnSchedule, changeTimeIntervalOnSchedule, changeDailyServiceOnSchedule } from '../../model/ScheduleModel_.js';
import { isAuthenticated } from '../../model/SessionModel_.js';

var clients__ = [];

export class Schedule extends React.Component {
    constructor(props) { 
        super(props);
        this.state = { 
            SchedulesByRoute : [],
            RoutesByClient : [],
            ClientsList : [],

            CLIENT_ENTITY : 0, // this.props.match.params.id,
            ROUTE_ENTITY : 0, // this.props.match.params.id, 
            TITLE_ROUTE : '',
            
            userAuthenticated : false,
        };
    } 

    checkIdRoute = () => {
        this.setState({ 
                CLIENT_ENTITY : parseInt(window.sessionStorage.getItem('ClientCode')),
                ROUTE_ENTITY : parseInt(window.sessionStorage.getItem('RouteCode')), 
            }, () => { 
                this.populateClientsList();               
                this.populateRoutesByClient();                  
                this.populateSchedulePerRoute();                        
            });
    }

    populateClientsList = () => {
        getClientsToComponent( ).then( r => {
            this.setState({ ClientsList : r, });
        });
    }

    populateRoutesByClient = () => {
        if (this.state.CLIENT_ENTITY > 0) {
            getGarbageRoutesByClient( this.state.CLIENT_ENTITY ).then( r => {
                // console.log(r);
                this.setState({
                    RoutesByClient : r,
                }, () => {
                    // this.updateNameRoute();
                });
            });
        }
    }

    populateSchedulePerRoute = () => {
        if (this.state.ROUTE_ENTITY > 0) {
            getScheduleByGarbageRoute( this.state.ROUTE_ENTITY ).then( r => {
                this.setState({ SchedulesByRoute : r, });
            });
        }
    }

    changeRoute = (event) => {
        /*
        this.setState({ 
            ROUTE_ENTITY : event.target.value, 
            TITLE_ROUTE : event.target.options[event.target.selectedIndex].dataset.addr,
        }, () => { // Cargar las variables de trayectoria
            this.populateSchedulePerRoute();
        });
        */
        window.alert('Función Deshabilitada');
    }

    changeClientId = (event) => {
        /*
        this.setState({ 
            CLIENT_ENTITY : event.target.value, 
        }, () => {
            this.populateRoutesByClient();
            this.populateSchedulePerRoute();
        });
        */
        window.alert('Función Deshabilitada');
    }

    updateNameRoute = () => {
        if (this.state.RoutesByClient.lengh > 0){
            var e = this.state.RoutesByClient.filter((x) => { return  (x.codigoRuteo === this.state.ROUTE_ENTITY)});
            this.setState({
                TITLE_ROUTE : e[0].denominacionRuteo, 
            }); 
        }
    }

    setEnabledStatus = (event) => {
        const SendThisData = {
            cliente : parseInt(this.state.CLIENT_ENTITY),
            firma : window.sessionStorage.getItem('eSignSession'),
            codigo : parseInt(event.target.dataset.id),
            estado : parseInt(event.target.value) === 1 ? 0 : 1,
        };
        changeStatusOnSchedule( SendThisData ).then( r => { 
            this.populateSchedulePerRoute(); 
        });
    } 

    /*----------------------------------------------------------------------*/
    showModalAddSchedule = () => {
        document.getElementById('mdlAddSchedule').style.display = 'block';
        document.getElementById('darkBackground').style.display = 'block';
    }

    hideModalAddSchedule = () => {
        document.getElementById('mdlAddSchedule').style.display = 'none';
        document.getElementById('darkBackground').style.display = 'none';
    }

    addScheduleItem = () => {
        this.hideModalAddSchedule();
        const abcd_ = {
            cliente : parseInt(this.state.CLIENT_ENTITY),
            firma : window.sessionStorage.getItem('eSignSession'),
            ruta : parseInt(this.state.ROUTE_ENTITY),
            zona : document.getElementById('zona_').value,
            hora : document.getElementById('hIn_').value,
            intervalo : document.getElementById('hOut_').value,    
        }
        console.warn(abcd_);
        addSchedule_(abcd_).then(r => {
            this.populateSchedulePerRoute();
        });
    }
    /*----------------------------------------------------------------------*/


    /*----------------------------------------------------------------------*/
    showModalEditTimeSchedule = (event) => {
        const a = event.target.dataset.id;
        const b = event.target.dataset.timestart;
        const c = event.target.dataset.timefinish;
        // cargar los datos
        document.getElementById('codigoHorario_').value = a;
        document.getElementById('hInEdt_').value = b;
        document.getElementById('hOutEdt_').value = c;
        // SHowModal == true
        document.getElementById('mdlEditTimeSchedule').style.display = 'block';
        document.getElementById('darkBackground').style.display = 'block';
        document.getElementById('hInEdt_').focus();
    }

    hideModalEditTimeSchedule = () => {
        document.getElementById('mdlEditTimeSchedule').style.display = 'none';
        document.getElementById('darkBackground').style.display = 'none';
    }

    updateTimeSchedule = () => {
        this.hideModalEditTimeSchedule();
        const yzz = {
            cliente : parseInt(this.state.CLIENT_ENTITY), 
            firma : window.sessionStorage.getItem('eSignSession'),
            codigo : document.getElementById('codigoHorario_').value,
            hora : document.getElementById('hInEdt_').value, 
            intervalo : document.getElementById('hOutEdt_').value,
        }     
        changeTimeIntervalOnSchedule( yzz ).then( r => {
            this.populateSchedulePerRoute();
        });
    }
    /*----------------------------------------------------------------------*/



    /*----------------------------------------------------------------------*/
    showModalEditZoneSchedule = (event) => {
        const a = event.target.dataset.id;
        const b = event.target.dataset.zone;

        document.getElementById('codigoHorarioEdt2_').value = a;
        document.getElementById('nameZone_').value = b;

        document.getElementById('mdlEditZoneSchedule').style.display = 'block';
        document.getElementById('darkBackground').style.display = 'block';
        document.getElementById('nameZone_').focus();
    }

    hideModalEditZoneSchedule = () => {
        document.getElementById('mdlEditZoneSchedule').style.display = 'none';
        document.getElementById('darkBackground').style.display = 'none';
    }

    updateNameZoneSchedule = () => {
        this.hideModalEditZoneSchedule();
        const yyy = {
            cliente : parseInt(this.state.CLIENT_ENTITY),
            firma : window.sessionStorage.getItem('eSignSession'),
            codigo : document.getElementById('codigoHorarioEdt2_').value,
            zona : document.getElementById('nameZone_').value, 
        }
        changeZoneNameOnSchedule( yyy ).then( r => {
            this.populateSchedulePerRoute();
        });
    }    
    /*----------------------------------------------------------------------*/


    updateDaysOnSchedule = (event) => {  // , a, b
        let $dias_ = [];
        const a = event.target.dataset.id;
        const b = event.target.dataset.index;
        for(let y = 0; y<=6; y++) {
            $dias_.push( Number(document.getElementById('chk['+ b +']['+ y +']').checked) );
        }
        console.log( 'New value :' + parseInt($dias_.join(''), 2) );
        const dataUpdate = {
            cliente : parseInt(this.state.CLIENT_ENTITY),
            firma : window.sessionStorage.getItem('eSignSession'),
            codigo : a,
            dias : parseInt($dias_.join(''), 2), 
        }
        changeDailyServiceOnSchedule( dataUpdate ).then( r => {
            this.populateSchedulePerRoute();
        });
    }



    componentDidMount() {
        if ( !isAuthenticated() ) {
            window.location.href = '/';
        } else {        
            this.setState({ userAuthenticated : true }, () => {
                this.checkIdRoute();
            });            
        }
    }

    render() {
        if (!this.state.userAuthenticated) {
            return (
                <div className="z">
                    <h1>Acceso denegado</h1>
                </div> 
            );
        } else {
            if ( this.state.RoutesByClient.length > 0) { 
                if ( this.state.SchedulesByRoute.length > 0) { 
                    clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });
                    return (
                        <div>
                        <GlobalHeader />
                        <ModulesTitle text="Horarios" />
                    
                        <div style={{width:'40%',margin:'0px auto'}}>
                            <section style={{display:'block'}}>{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select style={{width:'auto'}} onChange={this.changeClientId} value={this.state.CLIENT_ENTITY}><option value="0">Seleccione un Cliente</option>{clients__}</select></div> }
                            </section>
                            <br />
                            <section style={{display:'block'}}>
                                <select onChange={this.changeRoute} value={this.state.ROUTE_ENTITY}> 
                                <option value="0">Seleccione una ruta</option>
                                { 
                                    this.state.RoutesByClient.map((i) => { return (
                                        <option key={i.codigoRuteo} value={i.codigoRuteo} data-addr={i.denominacionRuteo}>{i.codigo}</option>
                                    ); })
                                }
                                </select>
                            </section>
                            <br />
                            <section style={{display:'block', fontSize:'120%',fontWeight:'bold'}}>&nbsp;{ this.state.TITLE_ROUTE }</section>
                    </div>
                    <main>
                        <table>
                            <colgroup>
                                <col style={{width:'20%'}} />
                                <col style={{width:'1.2%'}} />
                                <col style={{width:'1.2%'}} />
                                <col style={{width:'1.2%'}} />
                                <col style={{width:'1.2%'}} />
                                <col style={{width:'1.2%'}} />
                                <col style={{width:'1.2%'}} />
                                <col style={{width:'1.2%'}} />
                            </colgroup> 
                        <thead>
                            <tr style={{padding:'10px 3px'}}>
                                <th title="Zona/Bloque Urbano / Hora/Horario">
                                    Zona/Hora &nbsp;&nbsp;&nbsp; <button onClick={this.showModalAddSchedule}>Zona +</button>
                                </th>
                                { /* className='d2'><div className='d1'> <span>&nbsp;</span>  style={{}} style={{display:'inline-block',position:'relative',verticalAlign:'middle',whiteSpace:'nowrap',height:'8em'}} </div> */  }
                                <th title="Lunes">Lu</th>
                                <th title="Martes">Ma</th>
                                <th title="Miércoles">Mi</th>
                                <th title="Jueves">Jv</th>
                                <th title="Viernes">Vi</th>
                                <th title="Sábado">Sa</th>
                                <th title="Domingo">Do</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.SchedulesByRoute.map( (item, counter) => { 
                                const diasAtendidos_ = Number(item.atencionPorDias).toString(2).padStart(7,0);
                                return (
                                <tr key={'$route_' + counter }>
                                    <td style={{padding:'4px 3px'}}>
                                        <div style={{display:'table'}}>  
                                        <span style={{display:'table-cell',width:'2%'}}>
                                        
                                        <input type="checkbox" data-id={item.codigoHorario}
                                            name={'chk_'+item.codigoHorario}
                                            id={'chk_'+item.codigoHorario}
                                            value={ parseInt(item.habilitado) === 1 ? 1 : 0 }
                                            checked={ parseInt(item.habilitado) === 1 ? true : false }
                                            onChange={this.setEnabledStatus}
                                            title="Eliminar? la Zona de Atención" />
                                        </span>&nbsp;

                                        <span style={{display:'table-cell',minWidth:'30%',textAlign:'left'}} data-id={item.codigoHorario} onClick={this.showModalEditZoneSchedule} data-zone={item.zonaAfectada}><a style={{textDecoration:'none'}} href="../trajectory/" target="blank_">&#x25A1;</a> &nbsp; { item.zonaAfectada.toUpperCase() }</span>&nbsp;

                                        <span style={{display:'table-cell',minWidth:'18%',textAlign:'left'}} data-id={item.codigoHorario} data-timestart={item.horaInicio} data-timefinish={item.horaFin} onClick={this.showModalEditTimeSchedule}>{ item.horaInicio + ` \u2014 ` + item.horaFin }</span>
                                        
                                        <span style={{display:'table-cell',minWidth:'2%',textAlign:'left'}}>

                                        { /*
                                        <a href={'/trajectory/manual/' + item.codigoHorario} title="__" style={{textDecoration:'none'}}>
                                        &#x25C7;
                                        </a> */ }
                                        </span>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="checkbox" name={'chk[' + counter + '][0]'} id={'chk[' + counter + '][0]'} value={ parseInt(diasAtendidos_[0]) === 1 ? 1 : 0 } checked={ parseInt(diasAtendidos_[0]) === 1 ? true : false } onChange={this.updateDaysOnSchedule} data-id={item.codigoHorario} data-index={counter} />
                                    </td>

                                    <td>
                                        <input type="checkbox" name={'chk[' + counter + '][1]'} id={'chk[' + counter + '][1]'}
                                            value={ parseInt(diasAtendidos_[1]) === 1 ? 1 : 0 }
                                            checked={ parseInt(diasAtendidos_[1]) === 1 ? true : false } onChange={this.updateDaysOnSchedule} data-id={item.codigoHorario} data-index={counter} />
                                    </td>

                                    <td>
                                        <input type="checkbox" name={'chk[' + counter + '][2]'} id={'chk[' + counter + '][2]'}
                                            value={ parseInt(diasAtendidos_[2]) === 1 ? 1 : 0 }
                                            checked={ parseInt(diasAtendidos_[2]) === 1 ? true : false } onChange={this.updateDaysOnSchedule} data-id={item.codigoHorario} data-index={counter} />
                                    </td>

                                    <td>
                                        <input type="checkbox" name={'chk[' + counter + '][3]'} id={'chk[' + counter + '][3]'}
                                            value={ parseInt(diasAtendidos_[3]) === 1 ? 1 : 0 }
                                            checked={ parseInt(diasAtendidos_[3]) === 1 ? true : false }  onChange={this.updateDaysOnSchedule} data-id={item.codigoHorario} data-index={counter} />
                                    </td>

                                    <td>
                                        <input type="checkbox" name={'chk[' + counter + '][4]'} id={'chk[' + counter + '][4]'} 
                                            value={ parseInt(diasAtendidos_[4]) === 1 ? 1 : 0 } checked={ parseInt(diasAtendidos_[4]) === 1 ? true : false }  onChange={this.updateDaysOnSchedule} data-id={item.codigoHorario} data-index={counter} />
                                    </td>

                                    <td>
                                        <input type="checkbox" name={'chk[' + counter + '][5]'} id={'chk[' + counter + '][5]'}
                                            value={ parseInt(diasAtendidos_[5]) === 1 ? 1 : 0 }
                                            checked={ parseInt(diasAtendidos_[5]) === 1 ? true : false }  onChange={this.updateDaysOnSchedule} data-id={item.codigoHorario} data-index={counter} />
                                    </td>

                                    <td>
                                        <input type="checkbox" name={'chk[' + counter + '][6]'} id={'chk[' + counter + '][6]'}
                                            value={ parseInt(diasAtendidos_[6]) === 1 ? 1 : 0 }
                                            checked={ parseInt(diasAtendidos_[6]) === 1 ? true : false }  onChange={this.updateDaysOnSchedule} 
                                        data-id={item.codigoHorario} data-index={counter} />
                                    </td>
                                </tr>
                            )
                            } )
                        }
                        </tbody>
                        </table>
                        </main>

                        { /*--------------- ADD section --------------------------*/}   
                        <div id="mdlAddSchedule" className="overbox">
                            <div className="content">
                                <button onClick={this.hideModalAddSchedule}>Cerrar &times;</button><br />
                                <br /><hr /> <br />

                                <fieldset><legend>Área urbana atendida :</legend>
                                    <input type="text" name="zona_" id="zona_" /><br />
                                </fieldset><br />

                                <fieldset><legend>Hora Inicio de la Atención :</legend>
                                    <input type="time" name="hIn_" id="hIn_" /><br />
                                </fieldset><br />                                

                                <fieldset><legend>Hora Final de la Atención :</legend>
                                    <input type="time" name="hOut_" id="hOut_" /><br />
                                </fieldset><br />    

                                <hr /><br />
                                <div style={{textAlign:'right'}}><input type="button" value="Agregar/Registrar +" onClick={this.addScheduleItem} /></div>
                            </div>
                        </div>
                        { /*--------------- ADD section --------------------------*/}
    


                        { /*--------------- EDIT section --------------------------*/}   
                        <div id="mdlEditTimeSchedule" className="overbox">
                            <div className="content">
                                <button onClick={this.hideModalEditTimeSchedule}>Cerrar &times;</button><br />
                                <br /><hr /> <br />

                                <fieldset><legend>Hora Inicio de la Atención :</legend>
                                    <input type="time" name="hInEdt_" id="hInEdt_" /><br />
                                </fieldset><br />                                

                                <fieldset><legend>Hora Final de la Atención :</legend>
                                    <input type="time" name="hOutEdt_" id="hOutEdt_" /><br />
                                    <input type="hidden" name="codigoHorario_" id="codigoHorario_" />
                                </fieldset><br />    

                                <hr /><br />
                                <div style={{textAlign:'right'}}><input type="button" value="Modificar/Actualizar &rarr;" onClick={this.updateTimeSchedule} /></div>
                            </div>
                        </div>
                        { /*--------------- EDIT section --------------------------*/}    


                        { /*--------------- EDIT NAME section --------------------------*/}   
                        <div id="mdlEditZoneSchedule" className="overbox">
                            <div className="content">
                                <button onClick={this.hideModalEditZoneSchedule}>Cerrar &times;</button><br />
                                <br /><hr /> <br />

                                <fieldset><legend>Área urbana atendida :</legend>
                                    <input type="text" name="nameZone_" id="nameZone_" /><br />
                                    <input type="hidden" name="codigoHorarioEdt2_" id="codigoHorarioEdt2_" />
                                </fieldset><br />                                

                                <hr /><br />
                                <div style={{textAlign:'right'}}><input type="button" value="Modificar/Actualizar &rarr;" onClick={this.updateNameZoneSchedule} /></div>
                            </div>
                        </div>
                        { /*--------------- EDIT NAME section --------------------------*/}    

                        <BlackBackgroundModal />
                    </div>
                )
            } else {
                clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });
                return (
                    <div> 
                        <GlobalHeader />
                        <ModulesTitle text="Horarios" />
                        <br />
                        <div className="z1">
                        { parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.changeClientId} value={this.state.CLIENT_ENTITY}> {clients__}</select></div> }
                        </div>
                        <main>       
                            <h1>No existen datos registrados</h1>
                        </main>
                        
                         <BlackBackgroundModal />
                    </div>
                    );   
                } // END ELSE EMPTY       
            } else {
                return (
                    <div> 
                        <GlobalHeader />
                        <ModulesTitle text="Horarios" />

                        <div className="z1">
                        { parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.changeClientId} value={this.state.CLIENT_ENTITY}> {clients__}</select></div> }
                        </div>

                        <br />
                        <section style={{display:'block'}}>
                            <select onChange={this.changeRoute} value={this.state.ROUTE_ENTITY}> 
                                <option value="0">Seleccione una ruta</option>
                                { 
                                    this.state.RoutesByClient.map((i) => { return (
                                        <option key={i.codigoRuteo} value={i.codigoRuteo} data-addr={i.denominacionRuteo}>{i.codigo}</option>
                                    ); })
                                }
                        <   /select>
                        </section>

                        <main>       
                            <h1>No existen datos registrados</h1>
                        </main>

                        <BlackBackgroundModal />
                    </div>
                );
            } // END 
        }        
    }
}
export default Schedule;