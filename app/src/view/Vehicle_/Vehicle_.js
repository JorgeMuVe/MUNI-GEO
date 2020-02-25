import React from 'react';

import GlobalHeader from '../../component/GlobalHeader.js';
import ModulesTitle from '../../component/ModulesTitle.js';
import BlackBackgroundModal from '../../component/BlackBackgroundModal.js';

import { isAuthenticated } from '../../model/SessionModel_.js';
import { getClientsToComponent } from '../../model/ClientModel_.js';
import { getTotalVehicles, getListOfVehiclesByPage, addVehicle_, changeStatusOnVehicle, changeDataOnVechicle } from '../../model/VehicleModel_.js';

const ITEMSxPAGE = 10;
var clients__ = [];

const AddVehicleModal = ({closeFunction, performrAction, }) => {
	return (
		<div id="modalAddVehicle" className="overbox">
			<div className="content">
				<button onClick={closeFunction}>Cerrar &times;</button><br />
				<br /><hr /> <br />

				<fieldset><legend>Código/codificación de Ruta</legend>
					<input type="text" name="plaque_" id="plaque_" /><br />
				</fieldset><br />

				<hr /><br />
				<div style={{textAlign:'right'}}><input type="button" value="Agregar/Registrar +" onClick={performrAction} /></div>
			</div>
		</div>
	);
}

/*
const BlackBackgroundModal = () => {
	return (
		<div id="darkBackground" className="fadebox">&nbsp;</div>
	);
}*/

export class Vehicle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			VehiclesByClient : [],
			ClientsList : [],

			totalItems : 1, 
			numberOfPage : 1, 
			totalPages : 0,

			CLIENT_ENTITY : 0,
			userAuthenticated : false,            
		}
	}

	checkIdClient = () => {
		const tmpIdClient = parseInt(window.sessionStorage.getItem('ClientCode'));
		if (tmpIdClient !== 0) {
			this.setState({ 
				CLIENT_ENTITY : parseInt(window.sessionStorage.getItem('ClientCode')), }, () => {
					this.populateListOfVehicles(); 
			});     
		} else {
			window.history.replaceState({}, null, '/'); // window.history.href = '/';
		}
	}

	/*  */
	decreaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) > 1 ? parseInt(this.state.numberOfPage) - 1 : 1)
		}, () => { this.populateListOfVehicles() });
	}

	increaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) < this.state.totalPages ? parseInt(this.state.numberOfPage) + 1 : this.state.totalPages)
		}, () => { this.populateListOfVehicles() });
	}

	changeNumberOfPage = (event) => {
		const n = event.target.value;
		this.setState({
			numberOfPage : (parseInt(n) > 0 && parseInt(n) <= this.state.totalPages) ? n : 1,
		}, () => { this.populateListOfVehicles() });       
	}
	/*  */

	getClientsList = () => {
		getClientsToComponent( ).then( r => {
			// if ('total' in r) {
			//    const totalGarbageRoutes_ = parseInt( r.total );
			this.setState({ 
				ClientsList : r,
			});
			// }*/
		});
	}

	getTotalItems = () => {
		getTotalVehicles().then( r => {
			if ('total' in r) {
				const totalGarbageRoutes_ = parseInt( r.total );
				this.setState({ 
					totalItems : totalGarbageRoutes_,
					totalPages : parseInt(totalGarbageRoutes_ / ITEMSxPAGE) + (parseInt(totalGarbageRoutes_ % ITEMSxPAGE) !== 0 ? 1 : 0)
				});
			}
		});
	}

	setVehiclesByClient = (event) => {
		this.setState({
			CLIENT_ENTITY : event.target.value,
		}, () => {
			this.populateListOfVehicles(); 
		});
	} 

	showModalToAddVehicle = () => {
		document.getElementById('modalAddVehicle').style.display = 'block';
		document.getElementById('darkBackground').style.display = 'block';
	}

	hideModalToAddVehicle = () => {
		console.warn('Hello');
		document.getElementById('modalAddVehicle').style.display = 'none';
		document.getElementById('darkBackground').style.display = 'none';
		console.warn('ciao');
	}

	addNewVehicle = () => {
		this.hideModalToAddVehicle();
		const xgtf = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			placa : document.getElementById('plaque_').value,
		}
		addVehicle_( xgtf ).then(r => {
			this.populateListOfVehicles();
		});
	}

	/*   */
	showModalToEditVehicle = (event) => {
		document.getElementById('modalEditVehicle').style.display = 'block';
		document.getElementById('darkBackground').style.display = 'block';
		// recover dat to edit
		document.getElementById('codeVehicleEdt_').value = event.target.dataset.id;
		document.getElementById('plaqueEdt_').value = event.target.innerText;
		document.getElementById('plaqueEdt_').focus();
	}

	hideModalToEditVehicle = () => {
		document.getElementById('modalEditVehicle').style.display = 'none';
		document.getElementById('darkBackground').style.display = 'none';
	}

	updateLicenseVehicle = () => {
		this.hideModalToEditVehicle();
		const ftg = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : document.getElementById('codeVehicleEdt_').value,
			denominacion : document.getElementById('plaqueEdt_').value,
		}
		changeDataOnVechicle( ftg ).then(r => {
			this.populateListOfVehicles();
		});
	}
	/*   */

	setEnabledStatus = (event) => {
		const SendThisData = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : parseInt(event.target.dataset.id),
			estado : parseInt(event.target.value) === 1 ? 0 : 1,
		};
		changeStatusOnVehicle( SendThisData ).then( r => { 
			this.populateListOfVehicles(); 
		});
	}

	populateListOfVehicles = () => {
		var offset_ = (parseInt(this.state.numberOfPage) - 1) * ITEMSxPAGE;
		getListOfVehiclesByPage(offset_, ITEMSxPAGE, this.state.CLIENT_ENTITY ).then( r => {
			this.setState({ VehiclesByClient : r, });
		});
	}

	componentDidMount() {
		if ( !isAuthenticated() ) {
			window.location.href = '/';
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
			if ( this.state.VehiclesByClient.length > 0) {     
				clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });      
				return (
				<div>
					<GlobalHeader />
					<ModulesTitle text="Unidades de Recojo/Vehículos" />
					<div className="z1" style={{padding:'2% 4%',width:'90%'}}>
						{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setVehiclesByClient} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
					</div>
					<nav>
						<input type="button" name="prv_" value="&larr;" onClick={this.decreaseNumberOfPage} title="Página anterior" />
						<input type="number" name="pagina_" id="pagina_" min="1" pattern="[0-9]*" title="Número de Página" onChange={this.changeNumberOfPage} style={{textAlign:'center',border:'none',width:'4em'}} value={this.state.numberOfPage} />&nbsp;&nbsp;de&nbsp;&nbsp;
						<input type="text" name="totalEntidad_" id="totalEntidad_" size="2" style={{border:'none'}} title="Total de páginas a mostrar" value={this.state.totalPages} readOnly /> 
						<input type="button" name="nxt_" value="&rarr;" onClick={this.increaseNumberOfPage} title="Página siguiente" />
					&nbsp;&nbsp;&nbsp;<button onClick={this.showModalToAddVehicle}>Vehículo +</button>
					</nav>
					<main>
						<table>
							<thead>
								<tr>
									<th>Placa Única Nacional de Rodaje </th>{ /* <!-- th>Fabricante</th><th>Modelo</th><th>Compactador</th  --> */ }
									<th>&nbsp;</th>
								</tr>
							</thead>
							<tbody>
							{
								this.state.VehiclesByClient.map( (item, counter) => (
									<tr key={counter}>
										<td>
											<span onClick={this.showModalToEditVehicle} data-id={item.codigoUnidadRecolectora}>{item.identificadorUnidadRecolectora}</span>
										</td>	
										<td>
											<input type="checkbox" data-id={item.codigoUnidadRecolectora}
												name={'chk_'+item.codigoUnidadRecolectora}
												id={'chk_'+item.codigoUnidadRecolectora}
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

					{/* BEGIN --- Append Window */}
					<AddVehicleModal closeFunction={this.hideModalToAddVehicle} performrAction={this.addNewVehicle}/>
					{/* END --- Append Window */}

					{/* BEGIN --- EDIT Window */}
					<div id="modalEditVehicle" className="overbox">
						<div className="content">
							<button onClick={this.hideModalToEditVehicle}>Cerrar &times;</button><br />
							<br /><hr /> <br />

							<fieldset><legend>Código/codificación de Ruta</legend>
								<input type="text" name="plaqueEdt_" id="plaqueEdt_" /><br />
								<input type="hidden" name="codeVehicleEdt_" id="codeVehicleEdt_" />
							</fieldset><br />

							<hr /><br />
							<div style={{textAlign:'right'}}><input type="button" value="Modificar/Actualizar &rarr;" onClick={this.updateLicenseVehicle} /></div>		
						</div>
					</div>
					{/* END --- EDIT Window */}

					<BlackBackgroundModal />
				</div>
				);
			} else {
				clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });
				return (
					<div> 
						<GlobalHeader />
						<ModulesTitle text="Unidades de Recojo/Vehículos" />
						<div className="z1" style={{padding:'2% 5%',width:'90%'}}>{ /*  */}
							{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setVehiclesByClient} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
						</div>
						<main>       
							<div className="z1">
								<h1>No existen datos registrados</h1> 
							</div>
						</main>
						<div className="z1">
							<button onClick={this.showModalToAddVehicle}>Vehículo +</button>
						</div>

						<AddVehicleModal closeFunction={this.hideModalToAddVehicle} />
						<BlackBackgroundModal />
					</div>);
			}
		}
	}
}	

export default Vehicle