import React from 'react';
import { getOperationsPointsByClient, getOperationsLinesByClient } from '../../model/OperationModel_.js';
import { getWayPointsByScheduleItem } from '../../model/WayPointModel_.js';
import GlobalHeader from '../../component/GlobalHeader.js';
import { isAuthenticated } from '../../model/SessionModel_.js';
import ModulesTitle from '../../component/ModulesTitle.js';

export class WayPoint extends React.Component {
    constructor(props) { 
        super(props);
        this.state = { 
            WayPointsByScheduleItem : [],
            typePoints : [],
            typeTrajectories : [],
            
            CLIENT_ENTITY : 1,
            
            SCHEDULE_ENTITY : this.props.match.params.id, 

            userAuthenticated : false,
        };
    }

    showModalToAppendPoint = () => {
        document.getElementById('wnd2Add').style.display='block';
        document.getElementById('darkBackground').style.display='block';
        //document.getElementById('n_').value = '';
        //document.getElementById('n_').focus();
    }

    hideModalToAppendPoint = () => {
        document.getElementById('wnd2Add').style.display='none';
        document.getElementById('darkBackground').style.display='none';
    }

    // TO-DO: Enviar el CLIENTE apropiado 
    getListOfOperationsPoints = () => {
        getOperationsPointsByClient( this.state.CLIENT_ENTITY ).then( r => {
            this.setState({ typePoints : r, });
        });
    }

    getListOfOperationsLines = () => {
        getOperationsLinesByClient( this.state.CLIENT_ENTITY ).then( r => {
            this.setState({ typeTrajectories : r, });
        });
    }

    componentDidMount() {
        if ( !isAuthenticated() ) {
            window.location.href = '/';
        } else { 
            this.setState({ userAuthenticated : true }, () => {
                this.getListOfOperationsPoints(); // get Id Client
                this.getListOfOperationsLines();
                this.populateListOfWayPoints();
            });
        }
    }

    populateListOfWayPoints = () => {
        getWayPointsByScheduleItem( this.state.SCHEDULE_ENTITY ).then( r => {
            this.setState({ WayPointsByScheduleItem : r, });
        });
    }

    render() {
        if (!this.state.userAuthenticated) {
            return (
                <div className="z">
                    <h1>Acceso denegado</h1>
                </div> 
            );
        } else {
            if ( this.state.WayPointsByScheduleItem.length > 0) { 
                var optionsPoints_ = this.state.typePoints.map((v, i) => { return <option value={v.codigo}>{v.denominacion}</option> });
                var optionsLines_ = this.state.typeTrajectories.map((v, i) => { return <option value={v.codigo}>{v.denominacion}</option> });
                // var operators_ = typeOperators.map () 
                return (  
                <div>
                    <GlobalHeader></GlobalHeader>
                    <ModulesTitle text="Puntos/Coordenadas de una Trayectoria" />
                    <br />
                    <br />
                    <nav>
                        <button onClick={this.showModalToAppendPoint}>Editar Visualmente &spades;</button>&nbsp;&nbsp;
                        <button onClick={this.showModalToAppendPoint}>Agregar Coordenada +</button>&nbsp;&nbsp;
                        <button onClick={this.showModalToAppendPoint}>Desplegar Mapa &rarr;</button>
                    </nav>

                    { /* BEGIN -- Listado de puntos */ }
                    <main>   
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan={5}>
                                        <select style={{marginTop:'8px',marginBottom:'8px'}}>
                                            <option>Ruta : </option>
                                        </select>&nbsp;&nbsp;|&nbsp;&nbsp; 

                                        <select style={{marginTop:'8px',marginBottom:'8px'}}>
                                            <option>Zona/área : </option>
                                        </select>
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{width:'10%'}}>Orden</th>
                                    <th>Latitud</th>
                                    <th>Longitud</th>
                                    <th>&nbsp; { /* responsability */ }</th>
                                    <th>&nbsp; { /* typePoint */ }</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.WayPointsByScheduleItem.map( (item, counter) => (
                                    <tr key={counter}>
                                        <td style={{width:'10%'}}>{item.orden}</td>
                                        <td>{item.latitud}</td>
                                        <td>{item.longitud}</td>
                                        <td> 
                                            <select>
                                                <option value="0">Seleccione tipo de Punto</option>
                                                <optgroup label="Coordenada como Punto">{ optionsPoints_ }</optgroup>
                                                <optgroup label="Coordenada como Trayecto">{ optionsLines_ }</optgroup>
                                            </select>
                                        </td>
                                        <td>
                                            <select>
                                                <option value="0">Seleccione tipo de Operador/Trayecto</option>
                                                <option value="1">Vehículo</option>
                                                <option value="2">Operario</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </main>
                    {/* END -- Listado de puntos */ }

                    {/* BEGIN -- Agregar un punto */ }
                    <div id="wnd2Add" className="overbox">
                        <div className="content">            
                            <button onClick={this.hideModalToAppendPoint}>Cerrar &times;</button><br /><br />
                            <hr /><br />

                            <label for="">Latitud</label><br />
                            <input type="text" name="l1_" id="l1_" /><br /><br />   

                            <label for="">Longitud</label><br />
                            <input type="text" name="l2_" id="l1_" /><br /><br /> 

                            
                        </div>    
                    </div>
                    {/* END -- Agregar un punto */ }

                    <div id="darkBackground" className="fadebox">&nbsp;</div>
                </div>
                )
                //return (<div>Hello</div>);        
            } 
            else {
            return (
            <div> 
                <GlobalHeader></GlobalHeader>
                <br />
                <br />
                <br /> 
                <main>       
                    NO existen datos &nbsp; <button onClick={this.showModalToAddRoute}>Ruta +</button>
                </main>

                <div id="darkBackground" className="fadebox">&nbsp;</div>
            </div>);   
            }  
        }
    }
}

export default WayPoint

/*
<label> Es un punto</label><br />
                    <input type="text" name="" id="" /><br /><br />

                    <label></label>
                    <input type="" name="" id="" />
*/