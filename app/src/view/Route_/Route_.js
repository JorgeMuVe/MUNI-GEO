import React from 'react';
import GlobalHeader from '../../component/GlobalHeader.js'; 
import ModulesTitle from '../../component/ModulesTitle.js';
import { getTotalGarbageRoutes, getListOfGarbageRoutesByPage, addGarbageRoute, changeStatusOnRoute, changeDataOnRoute } from '../../model/RouteModel_.js';
import { getClientsToComponent } from '../../model/ClientModel_.js';
import { isAuthenticated } from '../../model/SessionModel_.js';

const ITEMSxPAGE = 10;
var clients__ = [];

export class GarbageRoute extends React.Component {
	constructor(props) { 
		super(props);
		this.state = { 
			GarbageRoutesByPage : [],
			ClientsList : [],

			totalItems : 1, 
			numberOfPage : 1, 
			totalPages : 0,
			
			CLIENT_ENTITY : 0, // this.props.match.params.id,        

			userAuthenticated : false,
		};
	} 

	checkIdClient = () => {
		const tmpIdClient = parseInt(window.sessionStorage.getItem('ClientCode'));
		if (tmpIdClient !== 0) {
			// TODO: TRY-CATCH ??
			this.setState({ 
				CLIENT_ENTITY : parseInt(window.sessionStorage.getItem('ClientCode')), }, () => {
					this.populateListOfGarbageRoutes();                        
			});     
			// TODO: TRY-CATCH ??
		} else {
			window.history.replaceState({}, null, '/'); // window.history.href = '/';
		}
	}

	goCheckSchedule = (event) => {
		const link_ = event.target.dataset.id;
		window.sessionStorage.setItem('ClientCode', this.state.CLIENT_ENTITY);
		window.sessionStorage.setItem('RouteCode', link_);

		window.location.href = '/schedule/'; 
	}

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
		getTotalGarbageRoutes().then( r => {
			if ('total' in r) {
				const totalGarbageRoutes_ = parseInt( r.total );
				this.setState({ 
					totalItems : totalGarbageRoutes_,
					totalPages : parseInt(totalGarbageRoutes_ / ITEMSxPAGE) + (parseInt(totalGarbageRoutes_ % ITEMSxPAGE) !== 0 ? 1 : 0)
				});
			}
		});
	}

	/*  */
	decreaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) > 1 ? parseInt(this.state.numberOfPage) - 1 : 1)
		}, () => { this.populateListOfGarbageRoutes() });
	}

	increaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) < this.state.totalPages ? parseInt(this.state.numberOfPage) + 1 : this.state.totalPages)
		}, () => { this.populateListOfGarbageRoutes() });
	}

	changeNumberOfPage = (event) => {
		const n = event.target.value;
		this.setState({
			numberOfPage : (parseInt(n) > 0 && parseInt(n) <= this.state.totalPages) ? n : 1,
		}, () => { this.populateListOfGarbageRoutes() });       
	}
	/*  */

	showModalToAddRoute = () => {
		document.getElementById('modalToAppendRoute').style.display='block';
		document.getElementById('darkBackground').style.display='block'; // document.getElementById('n_').value = '';

		document.getElementById('codigoRuta_').value = '';
		document.getElementById('nombreRuta_').value = '';
		document.getElementById('fechaRuta_').value = '';

		document.getElementById('codigoRuta_').focus();        
	}

	hideModalToAddRoute = () => {
		document.getElementById('modalToAppendRoute').style.display='none';
		document.getElementById('darkBackground').style.display='none';
	}

	showModalToEditRoute = (event) => {
		const i = parseInt(event.target.dataset.idx);
		document.getElementById('idRutaEdt_').value = parseInt(event.target.dataset.id);

		document.getElementById('codigoRutaEdt_').value = document.getElementById('c_[' + i + '][' + event.target.dataset.id + ']' ).innerText;
		document.getElementById('nombreRutaEdt_').value = document.getElementById('n_[' + i + '][' + event.target.dataset.id + ']' ).innerText;
		document.getElementById('fechaRutaEdt_').value = document.getElementById('f1_[' + i + '][' + event.target.dataset.id + ']' ).value;
		
		document.getElementById('modalToEditRoute').style.display='block';
		document.getElementById('darkBackground').style.display='block';
		
		document.getElementById('nombreRutaEdt_').focus();   
	}

	hideModalToEditRoute = () => {
		document.getElementById('modalToEditRoute').style.display='none';
		document.getElementById('darkBackground').style.display='none';
	}

	populateListOfGarbageRoutes = () => {
		var offset_ = (parseInt(this.state.numberOfPage) - 1) * ITEMSxPAGE;
		getListOfGarbageRoutesByPage( offset_, ITEMSxPAGE, this.state.CLIENT_ENTITY ).then( r => {
			//if ('total' in r) {
			this.setState({ GarbageRoutesByPage : r, });
			//}
		});
	}

	setRoutesByClient = (event) => {
		this.setState({ /* set the new id Client */
			CLIENT_ENTITY : event.target.value,
		}, () => {
			this.populateListOfGarbageRoutes(); 
		});
		// retrieve the new routes
	} 

	appendRoute = () => {
		// TO - DO : Validate!!!
		// hide modal
		this.hideModalToAddRoute();
		// retrieve data
		const abc = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			codificacion : document.getElementById('codigoRuta_').value,
			denominacion : document.getElementById('nombreRuta_').value,
			fechaInicio : document.getElementById('fechaRuta_').value,
			firma : window.sessionStorage.getItem('eSignSession'),
		}
		console.log( abc );
		addGarbageRoute( abc ).then( r => {
			this.populateListOfGarbageRoutes();
		});
	}

	updateRoutePartialData = () => {
		this.hideModalToEditRoute();
		// Validate data
		const xyz = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : document.getElementById('idRutaEdt_').value,
			codificacion : document.getElementById('codigoRutaEdt_').value,
			nombre : document.getElementById('nombreRutaEdt_').value,
			fecha : document.getElementById('fechaRutaEdt_').value,
		};
		changeDataOnRoute( xyz ).then( r => {
			this.populateListOfGarbageRoutes();
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

	setEnabledStatus = (event) => {
		const SendThisData = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : parseInt(event.target.dataset.id),
			estado : parseInt(event.target.value) === 1 ? 0 : 1,
		};
		changeStatusOnRoute( SendThisData ).then( r => { this.populateListOfGarbageRoutes(); });
	}

	render() {
		if (!this.state.userAuthenticated) {
			return (
				<div className="z"> 
					<h1>Acceso denegado</h1>
				</div> 
			);
		} else {
			// selected={this.state.CLIENT_ENTITY === i.codigoEntidad ? true : false }
			if ( this.state.GarbageRoutesByPage.length > 0) { 
				clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });
				return (
				<div>
					<GlobalHeader />
					<ModulesTitle text="Rutas" title="Rutas de Recojo de Desechos sólidos" />
					{/* <br /> */}
					<div className="z1" style={{padding:'2% 4%',width:'90%'}}>
						{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setRoutesByClient} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
					</div>
					{/* <br /> */}
					<nav>
						<input type="button" name="prv_" value="&larr;" onClick={this.decreaseNumberOfPage} title="Página anterior" />
						<input type="number" name="pagina_" id="pagina_" min="1" pattern="[0-9]*" title="Número de Página" onChange={this.changeNumberOfPage} style={{textAlign:'center',border:'none',width:'4em'}} value={this.state.numberOfPage} />&nbsp;&nbsp;de&nbsp;&nbsp;
						<input type="text" name="totalEntidad_" id="totalEntidad_" size="2" style={{border:'none'}} title="Total de páginas a mostrar" value={this.state.totalPages} readOnly /> 
						<input type="button" name="nxt_" value="&rarr;" onClick={this.increaseNumberOfPage} title="Página siguiente" />
					&nbsp;&nbsp;&nbsp;<button onClick={this.showModalToAddRoute}>Ruta +</button>
					</nav>
				<br />
				<main>
					<table>
						<thead>
							<tr>
								<th style={{width:'20%'}} title="Codificación de Rutas">&nbsp;</th>
								<th>Rutas</th>
								<th>&nbsp;</th>
								<th style={{width:'4%'}}>&nbsp;</th>
								<th style={{width:'4%'}}>&nbsp;</th>
								<th style={{width:'4%'}}>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
						{
							this.state.GarbageRoutesByPage.map( (item, counter) => (
								<tr key={'$route_' + counter }>
									<td>
										<span onClick={this.showModalToEditRoute} data-id={item.codigoRuteo} data-idx={counter} id={ 'c_[' + counter + ']['+  item.codigoRuteo + ']' }>{ item.codigo }</span>
									</td>
									<td>
										<span onClick={this.showModalToEditRoute} data-id={item.codigoRuteo} data-idx={counter} id={ 'n_[' + counter + ']['+  item.codigoRuteo + ']' }>{ item.denominacionRuteo }</span>
									</td>
									<td>
										<input data-idx={counter} type="hidden" id={ 'f1_[' + counter + ']['+  item.codigoRuteo + ']' } value={item.fechaEdicion} />
										<span onClick={this.showModalToEditRoute} data-id={item.codigoRuteo} data-idx={counter} id={ 'f_[' + counter + ']['+  item.codigoRuteo + ']' }>{ item.fechaDespliegue }</span>
									</td>
									<td>
										&nbsp;<a href="http://18.191.29.185:3000/mapa/1" target="BLANK_" title="Ver Mapa" style={{textDecoration:'none', cursor:'pointer'}}><small> &#x25CB;</small></a>
									</td>
									<td>
										&nbsp;<span onClick={this.goCheckSchedule} data-id={item.codigoRuteo} title="Ver Zonas/Horario de la Ruta" style={{textDecoration:'none', cursor:'pointer'}}>&#x25B7;</span> { /* */}
									</td>
									<td>
										<input type="checkbox" data-id={item.codigoRuteo}
											name={'chk_'+item.codigoRuteo}
											id={'chk_'+item.codigoRuteo}
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
				<div id="modalToAppendRoute" className="overbox">
					<div className="content">
						<button onClick={this.hideModalToAddRoute}>Cerrar &times;</button><br />
						<br /><hr /> <br />

						<fieldset><legend>Código/codificación de Ruta</legend>
						<input type="text" name="codigoRuta_" id="codigoRuta_" /><br />
						</fieldset>

						<fieldset><legend>Denominación de una ruta</legend>
						<textarea id="nombreRuta_" cols="60" rows="3" style={{outline:'none',resize:'none',padding:'4px'}} required></textarea>    
						<br />
						</fieldset>

						<fieldset><legend>Fecha de inicio (vigencia) de una ruta</legend>
						<input type="date" name="fechaRuta_" id="fechaRuta_" /><br />
						</fieldset><br />

						<hr /><br />
						
						<div style={{textAlign:'right'}}><input type="button" value="Agregar/Registrar +" onClick={this.appendRoute} /></div>
					</div>
				</div>
				{/* END --- Append Window */}



				{/* BEGIN --- EDIT label Window */}
				<div id="modalToEditRoute" className="overbox">
					<div className="content">
						<button onClick={this.hideModalToEditRoute}>Cerrar &times;</button> <br /><br />
						<hr /><br />

						<fieldset><legend>Código/codificación de Ruta</legend>
						<input type="text" name="codigoRutaEdt_" id="codigoRutaEdt_" /><br />
						</fieldset>

						<fieldset><legend>Denominación de una ruta</legend>
						<textarea id="nombreRutaEdt_" cols="60" rows="3" style={{outline:'none',resize:'none',padding:'4px'}}></textarea><br />
						</fieldset>

						<fieldset><legend>Fecha de inicio (vigencia) de una ruta</legend>
						<input type="date" name="fechaRutaEdt_" id="fechaRutaEdt_" /><br />
						</fieldset><br />

						<hr /><br /><input type="hidden" id="idRutaEdt_" name="idRutaEdt_" />
						
						<div style={{textAlign:'right'}}><input type="button" value="Editar/Actualizar &rarr;" onClick={this.updateRoutePartialData} /></div>
					</div>
				</div>
				{/* END --- EDIT label Window */}

				<div id="darkBackground" className="fadebox">&nbsp;</div>
			</div>
			)        
		} else {
			//  selected={this.state.CLIENT_ENTITY === i.codigoEntidad ? true : false }
			clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });
			return (
				<div> 
					<GlobalHeader />
					<ModulesTitle text="Rutas" title="Rutas de Recojo de Desechos sólidos" />
					<div className="z1" style={{padding:'2% 5%',width:'90%'}}>
						{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setRoutesByClient} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
					</div>
					<main> 
						<div className="z1">
							<h1>No existen datos registrados</h1> 
						</div>
					</main>

					<div id="darkBackground" className="fadebox">&nbsp;</div>
				</div>
				);   
			}  // END ELSE EMPTY  
		}
	}
}

export default GarbageRoute;


// <button onClick={this.showModalToAddRoute}>Ruta +</button>
// ,width:'calc(100% - 40px)'
// https://es.stackoverflow.com/questions/60104/evitar-que-input-se-salgan-del-contenedor-padre-box-sizing-no-funciona

/*
{/* label for="#">Codificación de la Ruta</label><br / * /}

	R &mdash; <input type="text" name="codigo1" id="codigo1" placeholder="##" title="Ingrese el Código" size="4" required /> &mdash; 

	<select id="codigo2" name="codigo2">
		<option value="-">-</option>
		{upperLetters_}
	</select> &nbsp; 
	<select id="codigo2a" name="codigo2a">
		<option value="-">-</option>
		{lowerLetters_}
	</select>  &mdash; 
{/*  div style="height:5em;padding-top:12px;padding-bottom:12px;" /}{/ /div /}
	{/* label for="codigo3"><!-- Codigo Numérico 3 : --></label * /}
	<select id="codigo3" name="codigo3">
		<option value="-">-</option>
		{numbers_}
	</select><br /><br />  
	{/ * Codigo Numérico 3 : * /}

	showModalToEditRouteCodification = (event) => {
		// Clean ALL - Deep Wash into ears!!!
		document.getElementById('codigo1editar').value = '';
		document.getElementById('codigo2editar').selectedIndex = 0;
		document.getElementById('codigo2aEditar').selectedIndex = 0;
		document.getElementById('codigo3editar').selectedIndex = 0;
		
		// Set Data state TO serialization MTF!!!! 
		document.getElementById('idCodigoEditar').value = parseInt(event.target.dataset.id);
		let strCodificacionRuta = event.target.innerText;
		let guion_ = strCodificacionRuta.indexOf('-');
		let numerico_ = strCodificacionRuta.substring(1, guion_);
		document.getElementById('codigo1editar').value = numerico_;

		let posNumerico_ = Number(guion_ + 1);    
		const letra1_ = strCodificacionRuta.substring(posNumerico_, posNumerico_ + 1);
		const letra2_ = strCodificacionRuta.substring(posNumerico_ + 1, posNumerico_ + 2);
		const letra3_ = strCodificacionRuta.substring(posNumerico_ + 2, posNumerico_ + 3);
		
		var p1_ = document.getElementById('codigo2editar');  
		for (let i=0; i<p1_.length; i++) { if (p1_.options[i].value === letra1_) { p1_.options[i].selected = true; }}; 

		var p2_ = document.getElementById('codigo2aEditar');  
		for (let i=0; i<p2_.length; i++) { if (p2_.options[i].value === letra2_) { p2_.options[i].selected = true; }};

		var p3_ = document.getElementById('codigo3editar');  
		for (let i=0; i<p3_.length; i++) { if (p3_.options[i].value === letra3_) { p3_.options[i].selected = true; }};

		document.getElementById('modalToEditRouteCodification').style.display='block';
		document.getElementById('darkBackground').style.display='block';

		// document.getElementById('codigo1').focus();
	}

	hideModalToEditRouteCodification = () => {
		document.getElementById('modalToEditRouteCodification').style.display='none';
		document.getElementById('darkBackground').style.display='none';
	}
*/