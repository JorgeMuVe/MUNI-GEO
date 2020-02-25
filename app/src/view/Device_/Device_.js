import React from 'react';
import GlobalHeader from '../../component/GlobalHeader.js'; 
import ModulesTitle from '../../component/ModulesTitle.js';
import BlackBackgroundModal from '../../component/BlackBackgroundModal.js';

import { getClientsToComponent } from '../../model/ClientModel_.js';
import { isAuthenticated } from '../../model/SessionModel_.js';
import { getTotalDevices, getListOfDevicesByPage, addDevice_, changeStatusOnDevice, changeDataOnDevice } from '../../model/DeviceModel_.js';
//  

const ITEMSxPAGE = 10;
var clients__ = [];

const AddModalDevice = ({closeFunction, performrAction, }) => {
	return (
		<div id="modalAddDevice" className="overbox">
			<div className="content">
				<button onClick={closeFunction}>Cerrar &times;</button><br />
				<br /><hr /> <br />

				<fieldset><legend>Denominación del dispositivo</legend>
					<input type="text" name="nombreDispositivo_" id="nombreDispositivo_" /><br />
				</fieldset><br />

				<fieldset><legend>Número de Serie (Hardware/IMEI) </legend>
					<input type="text" name="serieDispositivo_" id="serieDispositivo_" /><br />
				</fieldset><br />

				<hr /><br />
				<div style={{textAlign:'right'}}><input type="button" value="Agregar/Registrar +" onClick={performrAction} /></div>
			</div>
		</div>
	);
}

export class Device extends React.Component {
	constructor(props) { 
		super(props);
		this.state = { 
			DevicesByPage : [],
			ClientsList : [],

			totalItems : 1, 
			numberOfPage : 1, 
			totalPages : 0,
			
			CLIENT_ENTITY : 0, // this.props.match.params.id,
			userAuthenticated : false,
		};
	} 

	/*  */
	decreaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) > 1 ? parseInt(this.state.numberOfPage) - 1 : 1)
		}, () => { this.populateListOfDevices() });
	}

	increaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) < this.state.totalPages ? parseInt(this.state.numberOfPage) + 1 : this.state.totalPages)
		}, () => { this.populateListOfDevices() });
	}

	changeNumberOfPage = (event) => {
		const n = event.target.value;
		this.setState({
			numberOfPage : (parseInt(n) > 0 && parseInt(n) <= this.state.totalPages) ? n : 1,
		}, () => { this.populateListOfDevices() });       
	}
	/*  */

	checkIdClient = () => {
		const tmpIdClient = parseInt(window.sessionStorage.getItem('ClientCode'));
		if (tmpIdClient !== 0) {
			this.setState({ 
				CLIENT_ENTITY : parseInt(window.sessionStorage.getItem('ClientCode')), }, () => {
					this.populateListOfDevices(); 
			});     
		} else {
			window.history.replaceState({}, null, '/'); // window.history.href = '/';
		}
	}

	getClientsList = () => {
		getClientsToComponent( ).then( r => {
			this.setState({ ClientsList : r, });
		});
	}

	getTotalItems = () => {
		getTotalDevices().then( r => {
			if ('total' in r) {
				const totalGarbageRoutes_ = parseInt( r.total );
				this.setState({ 
					totalItems : totalGarbageRoutes_,
					totalPages : parseInt(totalGarbageRoutes_ / ITEMSxPAGE) + (parseInt(totalGarbageRoutes_ % ITEMSxPAGE) !== 0 ? 1 : 0)
				});
			}
		});
	}

	setDevicesByClient = (event) => {
		this.setState({
			CLIENT_ENTITY : event.target.value,
		}, () => {
			this.populateListOfDevices(); 
		});
	} 

	/* -------------- {begin} ADD SECTION /// BIZ LOGIC -------------------- */
	showModalToAddDevice = () => {
		document.getElementById('modalAddDevice').style.display = 'block';
		document.getElementById('darkBackground').style.display = 'block';
		document.getElementById('nombreDispositivo_').focus();
	}

	hideModalToAddDevice = () => {
		document.getElementById('modalAddDevice').style.display = 'none';
		document.getElementById('darkBackground').style.display = 'none';
	} 

	appendDevice = () => {
		this.hideModalToAddDevice();
		const edf = {
			cliente :  parseInt(this.state.CLIENT_ENTITY),
        	firma : window.sessionStorage.getItem('eSignSession'),
        	serial : document.getElementById('serieDispositivo_').value,
        	denominacion : document.getElementById('nombreDispositivo_').value,
		}
		addDevice_(edf).then(r => {
			this.populateListOfDevices();
		});
	}
	/* -------------- {end} ADD SECTION /// BIZ LOGIC -------------------- */



	/* --------------- {begin} EDIT SECTION ------------------------ */
	showModalToEditDevice = (event) => {
		// recover data
		const a = event.target.dataset.id;
		const b = event.target.dataset.serial;
		const c = event.target.dataset.named;
		// Put the dat on FIELDS
		document.getElementById('codigoDispositivoEdt_').value = a;
		document.getElementById('nombreDispositivoEdt_').value = c;
		document.getElementById('serieDispositivoEdt_').value = b;
		// FOCUS
		document.getElementById('modalEditDevice').style.display = 'block';
		document.getElementById('darkBackground').style.display = 'block';
		document.getElementById('nombreDispositivoEdt_').focus();
	}

	hideModalToEditDevice = () => {
		document.getElementById('modalEditDevice').style.display = 'none';
		document.getElementById('darkBackground').style.display = 'none';
	}

	updateDataDevice = () => {
		this.hideModalToEditDevice();
		const abc_ = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : document.getElementById('codigoDispositivoEdt_').value,
			serie : document.getElementById('serieDispositivoEdt_').value,
			denominacion : document.getElementById('nombreDispositivoEdt_').value,
		}
		changeDataOnDevice( abc_ ).then(r => {
			this.populateListOfDevices();
		});
	}
	/* --------------- {end} EDIT SECTION ------------------------ */

	setEnabledStatus = (event) => {
		const SendThisData = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : parseInt(event.target.dataset.id),
			estado : parseInt(event.target.value) === 1 ? 0 : 1,
		};
		changeStatusOnDevice( SendThisData ).then( r => { 
			this.populateListOfDevices(); 
		});
	}

	populateListOfDevices = () => {
		var offset_ = (parseInt(this.state.numberOfPage) - 1) * ITEMSxPAGE;
		getListOfDevicesByPage(offset_, ITEMSxPAGE, this.state.CLIENT_ENTITY ).then( r => {
			this.setState({ DevicesByPage : r, });
		});
	}

	componentDidMount() {
		if ( !isAuthenticated() ) {
			window.location.href = '/'; // window.location.replaceState...
		} else {        
			this.setState({ userAuthenticated : true }, () => {
				this.checkIdClient();
				this.getClientsList();
				this.getTotalItems();
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
			if ( this.state.DevicesByPage.length > 0) { 
				return (
					<div>
						<GlobalHeader />
						<ModulesTitle text="Dispositivos" title="Dispositivos capturadores de geolocalización/GPS" />

						<div className="z1" style={{padding:'2% 4%',width:'90%'}}>
						{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setDevicesByClient} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
						</div>

						<nav>
							<input type="button" name="prv_" value="&larr;" onClick={this.decreaseNumberOfPage} title="Página anterior" />
							<input type="number" name="pagina_" id="pagina_" min="1" pattern="[0-9]*" title="Número de Página" onChange={this.changeNumberOfPage} style={{textAlign:'center',border:'none',width:'4em'}} value={this.state.numberOfPage} />&nbsp;&nbsp;de&nbsp;&nbsp;
							<input type="text" name="totalEntidad_" id="totalEntidad_" size="2" style={{border:'none'}} title="Total de páginas a mostrar" value={this.state.totalPages} readOnly /> 
							<input type="button" name="nxt_" value="&rarr;" onClick={this.increaseNumberOfPage} title="Página siguiente" />
						&nbsp;&nbsp;&nbsp;<button onClick={this.showModalToAddDevice}>Dispositivo +</button>
						</nav>

						<main>
							<table>
								<thead>
									<tr>
										<th>&nbsp;Identificador/Denominación</th>
										<th>&nbsp;Número de Serie/IMEI</th>
										<th>&nbsp;</th>
									</tr>
								</thead>
								<tbody>
								{
									this.state.DevicesByPage.map( (item, counter) => (
									<tr key={counter}>
										<td>
											<span data-id={item.codigoDispositivo} data-serial={item.numeroSerie} data-named={item.denominacionDispositivo} onClick={this.showModalToEditDevice}>{item.denominacionDispositivo}</span>
										</td>
										<td>
											<span onClick={this.showModalToEditDevice} data-id={item.codigoDispositivo} data-serial={item.numeroSerie} data-named={item.denominacionDispositivo}>{item.numeroSerie}</span>
										</td>
										<td>
											<input type="checkbox" data-id={item.codigoDispositivo}
												name={'chk_' + item.codigoDispositivo}
												id={'chk_' + item.codigoDispositivo}
												value={ parseInt(item.habilitado) === 1 ? 1 : 0 }
												checked={ parseInt(item.habilitado) === 1 ? true : false }
												onChange={this.setEnabledStatus}
												title="Habilitar/Deshabilitar al Cliente" />
										</td>
									</tr>
									))
								}
								</tbody>
							</table>
						</main>

						<AddModalDevice closeFunction={this.hideModalToAddDevice} performrAction={this.appendDevice} />
						

						{ /* --------------- Edit section ----------------------- */ }
						<div id="modalEditDevice" className="overbox">
							<div className="content">
								<button onClick={this.hideModalToEditDevice}>Cerrar &times;</button><br />
								<br /><hr /> <br />

								<fieldset><legend>Denominación del dispositivo</legend>
									<input type="text" name="nombreDispositivoEdt_" id="nombreDispositivoEdt_" />
								</fieldset><br />

								<fieldset><legend>Número de Serie (Hardware/IMEI) </legend>
									<input type="text" name="serieDispositivoEdt_" id="serieDispositivoEdt_" />
									<input type="hidden" name="codigoDispositivoEdt_" id="codigoDispositivoEdt_" />
								</fieldset><br />

								<hr /><br />
								<div style={{textAlign:'right'}}><input type="button" value="Modificar/Actualizar &rarr;" onClick={this.updateDataDevice} /></div>
							</div>
						</div>
						{ /* --------------- Edit section ----------------------- */ }


						<BlackBackgroundModal />


					</div>
				);
			} else {
				clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });
				return (
					<div>
						<GlobalHeader />
						<ModulesTitle text="Dispositivos" title="Dispositivos capturadores de geolocalización/GPS" />
						<div className="z1" style={{padding:'2% 5%',width:'90%'}}>{ /*  */}
							{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setDevicesByClient} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
						</div>
						<main> 
							<div className="z1">
								<h1>No existen datos registrados</h1> 
							</div>
						</main>

						<div className="z1">
							<button onClick={this.showModalToAddDevice}>Dispositivo +</button>
						</div>

						<AddModalDevice closeFunction={this.hideModalToAddDevice} performrAction={this.appendDevice} />
						<BlackBackgroundModal />
					</div>
				);
			} 
		} // final del ELSE
	}
}

export default Device;