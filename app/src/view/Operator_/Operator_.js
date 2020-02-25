import React from 'react';
import GlobalHeader from '../../component/GlobalHeader.js'; 
import ModulesTitle from '../../component/ModulesTitle.js';

import { isAuthenticated } from '../../model/SessionModel_.js';
import { getClientsToComponent } from '../../model/ClientModel_.js';
import { getTotalOperatorsRegistered, getOperatorsByPage, changeStatusFromOperator, appendNewOperator, updateOperatorLabels_, updateOperatorDoc_ } from '../../model/OperatorModel_.js';
import { getDocumentClasification } from '../../model/DictDocumentModel_.js';

const ITEMSxPAGE = 10;

export class Operator extends React.Component {
	constructor(props) { 
		super(props);
		this.state = { 
			PersonalByClientList : [],  
			ClientsList : [],
			ClassificationDocumentList : [], 

			totalItems : 1, 
			numberOfPage : 1, 
			totalPages : 0,

			CLIENT_ENTITY : 0,
			userAuthenticated : false,            
		};
	}

	checkIdClient = () => {
		const tmpIdClient = parseInt(window.sessionStorage.getItem('ClientCode'));
		if (tmpIdClient !== 0) {
			// TODO: TRY-CATCH ??
			this.setState({ 
				CLIENT_ENTITY : parseInt(window.sessionStorage.getItem('ClientCode')), }, () => {
					this.populateOperatorsList();                        
			});     
			// TODO: TRY-CATCH ??
		} else {
			window.history.replaceState({}, null, '/'); // window.history.href = '/';
		}
	}

	decreaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) > 1 ? parseInt(this.state.numberOfPage) - 1 : 1)
		}, () => { this.populateOperatorsList() });
	}

	increaseNumberOfPage = () => {
		this.setState({
			numberOfPage : ( parseInt(this.state.numberOfPage) < this.state.totalPages ? parseInt(this.state.numberOfPage) + 1 : this.state.totalPages)
		}, () => { this.populateOperatorsList() });
	}

	changeNumberOfPage = (event) => {
		const n = event.target.value;
		this.setState({
			numberOfPage : (parseInt(n) > 0 && parseInt(n) <= this.state.totalPages) ? n : 1,
		}, () => { this.populateOperatorsList() });       
	}

	getClassificationDocument = () => {
		getDocumentClasification().then( r => {
			this.setState({ ClassificationDocumentList : r, });
		});
	}

	getClientsList = () => {
		getClientsToComponent().then( r => {
			this.setState({ ClientsList : r, });
		});
	}

	getTotalItems = () => {
		getTotalOperatorsRegistered().then( r => {
			if ('total' in r) {
				const totalOperators_ = parseInt( r.total );
				this.setState({ 
					totalItems : totalOperators_,
					totalPages : parseInt(totalOperators_ / ITEMSxPAGE) + (parseInt(totalOperators_ % ITEMSxPAGE) !== 0 ? 1 : 0)
				});
			}
		});
	}

	setEnabledStatus = (event) => {
		const datum = {
			cliente : parseInt(window.sessionStorage.getItem('idClient')),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : parseInt(event.target.dataset.id),
			estado : parseInt(event.target.value) === 1 ? 0 : 1,
		}
		changeStatusFromOperator( datum ).then( r => { this.populateOperatorsList() });
	}
	
	setClientID = (event) => { // Change the ID 
		this.setState({
			CLIENT_ENTITY : event.target.value,
		}, () => { 
			this.populateOperatorsList(); 
		});
	}

	/* ---------------------  ADD ---------------------------------- */
	showModalToAddOperator = () => {
		document.getElementById('modalToAppendOperator').style.display='block';
		document.getElementById('darkBackground').style.display='block'; // document.getElementById('n_').value = '';
		document.getElementById('nombre_').value = '';
		document.getElementById('apPaterno_').value = '';
		document.getElementById('apMaterno_').value = '';
		document.getElementById('nombre_').focus();        
	}

	hideModalToAddOperator = () => {
		document.getElementById('modalToAppendOperator').style.display='none';
		document.getElementById('darkBackground').style.display='none';
	}

	appendOperator = () => {
		this.hideModalToAddOperator();
		const id_ = document.getElementById('tipoDoc_');
		const tmp_ = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			tipo :  id_.options[id_.selectedIndex].value,
			documento : document.getElementById('documento_').value,
			nombre : document.getElementById('nombre_').value,
			paterno : document.getElementById('apPaterno_').value,
			materno : document.getElementById('apMaterno_').value,
			firma : window.sessionStorage.getItem('eSignSession'),
		}
		appendNewOperator(tmp_).then( r => {
			 this.populateOperatorsList();
		});
	}
	/* ---------------------  ADD ---------------------------------- */

	/* --------------------- EDIT/DOCUMENT ---------------------------------- */
	showModalEditDocument = (event) => {
		const idx = event.target.dataset.id;
		const tdoc = event.target.dataset.doc;
		document.getElementById('modalToEditOperatorDocument').style.display='block';
		document.getElementById('darkBackground').style.display='block';
		var p_ = document.getElementById('tipoDocEdt_');  
		for (let i=0; i<p_.length; i++) { if (p_.options[i].value === tdoc) { p_.options[i].selected = true; }};
		document.getElementById('codigoEdtDoc_').value = idx;	
		document.getElementById('numeroDocumentoEdt_').value = event.target.innerText;
		document.getElementById('numeroDocumentoEdt_').focus();
	}

	hideModalToEditOperatorDocument = () => {
		document.getElementById('modalToEditOperatorDocument').style.display='none';
		document.getElementById('darkBackground').style.display='none';
	}

	updateDocumentOperator = () => {
		this.hideModalToEditOperatorDocument();
		var p$_ = document.getElementById('tipoDocEdt_');  
		const kkk = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			firma : window.sessionStorage.getItem('eSignSession'),
			codigo : document.getElementById('codigoEdtDoc_').value,
			tipo : p$_.options[p$_.selectedIndex].value,
			documento : document.getElementById('numeroDocumentoEdt_').value,
		}
		updateOperatorDoc_( kkk ).then(r => {
			this.populateOperatorsList();
		});
	} 
	/* --------------------- EDIT/DOCUMENT ---------------------------------- */

	/* --------------------- EDIT/NAMES ---------------------------------- */
	showModalEditLabels = (event) => {
		// show edit modal ???
		document.getElementById('modalToEditOperator').style.display='block';
		document.getElementById('darkBackground').style.display='block';

		document.getElementById('codigoEdt_').value = event.target.dataset.id;
		document.getElementById('nombreEdt_').value = event.target.dataset.nombre;
		document.getElementById('apPaternoEdt_').value = event.target.dataset.paterno;
		document.getElementById('apMaternoEdt_').value = event.target.dataset.materno;
		document.getElementById('nombreEdt_').focus();
	}

	hideModalToEditLabels = () => {
		document.getElementById('modalToEditOperator').style.display='none';
		document.getElementById('darkBackground').style.display='none';	
	}

	updateLabelOperator = () => {
		this.hideModalToEditLabels();
		const ttt = {
			cliente : parseInt(this.state.CLIENT_ENTITY),
			codigo : document.getElementById('codigoEdt_').value,
			nombre : document.getElementById('nombreEdt_').value,
			paterno : document.getElementById('apPaternoEdt_').value, 
			materno : document.getElementById('apMaternoEdt_').value,
			firma : window.sessionStorage.getItem('eSignSession'),
		}
		updateOperatorLabels_(ttt).then( r => {
			this.populateOperatorsList();
		});
	}
	/* --------------------- EDIT/NAMES ---------------------------------- */

	getLabelDocumentByCode = ( idx ) => {
		// return Type oF Document
	}

	populateOperatorsList = () => {
		var offset_ = (parseInt(this.state.numberOfPage) - 1) * ITEMSxPAGE;
		getOperatorsByPage( offset_, ITEMSxPAGE, this.state.CLIENT_ENTITY ).then( r => {
			this.setState({ PersonalByClientList : r, });
		});
	}
	
	componentDidMount() {
		if ( !isAuthenticated() ) {
			window.location.href = '/';
		} else {        
			this.setState({ userAuthenticated : true }, () => {
				this.checkIdClient();
				this.getClientsList();
				this.getClassificationDocument();
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
			var clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} key={i.codigoEntidad}>{i.denominacionEntidad}</option> ); });
			var t_ = this.state.ClassificationDocumentList.map( i => { return( <option value={i.id} key={i.id}>{i.denominacion}</option> ); });
			if ( this.state.PersonalByClientList.length > 0) {
				return (
				<div>
					<GlobalHeader></GlobalHeader>
					<ModulesTitle text="Personal/Operadores - Choferes" title="Personal a cargo del Recojo de Desechos sólidos" />

					<div className="z1" style={{padding:'2% 5%',width:'90%'}}>
						{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setClientID} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
					</div>
					
					<nav>
						<input type="button" name="prv_" value="&larr;" onClick={this.decreaseNumberOfPage} title="Página anterior" />
						<input type="number" name="pagina_" id="pagina_" min="1" pattern="[0-9]*" title="Número de Página" onChange={this.changeNumberOfPage} style={{textAlign:'center',border:'none',width:'4em'}} value={this.state.numberOfPage} />&nbsp;&nbsp;de&nbsp;&nbsp;
						<input type="text" name="totalEntidad_" id="totalEntidad_" size="2" style={{border:'none'}} title="Total de páginas a mostrar" value={this.state.totalPages} readOnly /> 
						<input type="button" name="nxt_" value="&rarr;" onClick={this.increaseNumberOfPage} title="Página siguiente" />
					&nbsp;&nbsp;&nbsp;<button onClick={this.showModalToAddOperator}>Nuevo Operador +</button>
					</nav>
					<br />
					
					<main>						
						<table>							
							<thead>
								<tr>
									<th style={{width:'25%'}}>&nbsp;Documento de Identidad&nbsp;</th>
									<th style={{width:'60%'}}>Apellidos - Nombres</th>
									<th title="¿está el operador habilitado?">&nbsp;</th>
								</tr>
							</thead>
							<tbody>
							{
								this.state.PersonalByClientList.map( (item) => (
									<tr key={'cx_' + item.codigoPersona }>
										<td>&nbsp;<span title={ item.tipoDocumentoIdentificatorio }>&#x25CB; </span>&nbsp;
											<span onClick={this.showModalEditDocument} data-id={ item.codigoPersona } data-doc={ item.tipoDocumentoIdentificatorio }>{ item.numeroDocumentoIdentificatorio }</span>
										</td>
										<td>
											<span onClick={this.showModalEditLabels} data-id={item.codigoPersona} data-paterno={item.apellidoPaterno} data-materno={item.apellidoMaterno} data-nombre={item.nombre}>{ item.apellidoPaterno.toUpperCase() + ' ' + item.apellidoMaterno.toUpperCase() + ', ' +  item.nombre }</span> 
										</td>
										<td>
											<input type="checkbox" data-id={item.codigoPersona}
												name={'chk_' + item.codigoPersona}
												id={'chk_' + item.codigoPersona}
												value={ parseInt(item.habilitado) === 1 ? 1 : 0 }
												checked={ parseInt(item.habilitado) === 1 ? true : false }
												onChange={this.setEnabledStatus}
												title="Habilitar/Deshabilitar al operador" />
										</td>                                    
									</tr>
								))
							}
							</tbody>
						</table>
					</main>

					{ /* BEGIN -- Add section */ }
					<div id="modalToAppendOperator" className="overbox">
						<div className="content">
							<button onClick={this.hideModalToAddOperator}>Cerrar &times;</button> <br /><br /><hr /><br />
							
							<fieldset><legend>Tipo de Documento/Documento de Identidad : </legend>
								<select name="tipoDoc_" id="tipoDoc_" defaultValue={-1}>
								<option value="-1"> Seleccione una opción</option>
								{t_}
								</select>&nbsp;&nbsp;<input style={{border:'1px solid slategray', borderRadius:'4px',padding:'6px'}} type="text" name="documento_" id="documento_" required /><br />
							</fieldset>

							<fieldset><legend>Nombre : </legend>
								<input type="text" name="nombre_" id="nombre_" required /><br />
								<br />
							</fieldset>
								
							<fieldset><legend>Apellido Paterno : </legend>
								<input type="text" name="apPaterno_" id="apPaterno_" required /><br />
								<br />
							</fieldset>
							
							<fieldset><legend>Apellido Materno : </legend>
								<input type="text" name="apMaterno_" id="apMaterno_" /><br />
								<br />
							</fieldset>
							
							<br /><hr /><br />
							<div style={{textAlign:'right'}}><input type="button" value="Agregar/Registrar +" onClick={this.appendOperator} /></div>
						</div>	
					</div>
					{ /* END -- Add section */ }



					{ /* BEGIN -- Edit section */ }
					<div id="modalToEditOperator" className="overbox">
						<div className="content">
							<button onClick={this.hideModalToEditLabels}>Cerrar &times;</button> <br /><br /><hr /><br />

							<fieldset><legend>Nombre : </legend>
								<input type="text" name="nombreEdt_" id="nombreEdt_" required /><br />
								<br />
							</fieldset>

							<fieldset><legend>Apellido Paterno : </legend>
								<input type="text" name="apPaternoEdt_" id="apPaternoEdt_" required /><br />
								<br />
							</fieldset>
							
							<fieldset><legend>Apellido Materno : </legend>
								<input type="text" name="apMaternoEdt_" id="apMaternoEdt_" /><br />
								<input type="hidden" name="codigoEdt_" id="codigoEdt_" />
								<br />
							</fieldset>

							<br /><hr /><br />
							<div style={{textAlign:'right'}}><input type="button" value="Editar/Actualizar &rarr;" onClick={this.updateLabelOperator} /></div>
						</div>
					</div>
					{ /* END -- Edit section */ }



					{ /* Edit -- document */ }
					<div id="modalToEditOperatorDocument" className="overbox">
						<div className="content">
							<button onClick={this.hideModalToEditOperatorDocument}>Cerrar &times;</button> <br /><br /><hr /><br />

							<fieldset><legend>Número de Identidad : </legend>
								<select name="tipoDocEdt_" id="tipoDocEdt_" defaultValue={-1}>
								<option value="-1"> Seleccione una opción</option>
								{t_}
								</select>&nbsp;&nbsp;<input type="text" name="numeroDocumentoEdt_" id="numeroDocumentoEdt_" required /><br />
								<input type="hidden" name="codigoEdtDoc_" id="codigoEdtDoc_" />
								<br />
							</fieldset>

							<br /><hr /><br />
							<div style={{textAlign:'right'}}><input type="button" value="Agregar/Registrar +" onClick={this.updateDocumentOperator} /></div>
						</div>
					</div>

					<div id="darkBackground" className="fadebox">&nbsp;</div>
				</div>
				);
			} else {
				return (
					<div> 
						<GlobalHeader />
						<ModulesTitle text="Personal/Operadores - Choferes" title="Personal a cargo del Recojo de Desechos sólidos" />
						<div className="z1" style={{padding:'2% 5%',width:'90%'}}>
						{ parseInt(window.sessionStorage.getItem('role')) === 1 && <div><select onChange={this.setClientID} value={this.state.CLIENT_ENTITY} style={{width:'100%', boxSizing:'border-box'}}>{clients__}</select></div> }
						</div>
						<main> 
							<div className="z1">
								<h1>No existen datos registrados</h1> 
							</div>
						</main>
					</div>
				);
			}
		}
	}
}

export default Operator

/*
var numbers_ = Array.from("12345").map( (i) => { return ( <option value={i} key={'c'+i}>{i}</option> ); });

onClick2="mostrarVentanaEditarModal(\'' + empresasCliente[i].codigoEntidad + '\', \'' + empresasCliente[i].denominacionEntidad + '\', \'' + empresasCliente[i].denominacionSubEntidad + '\');"

return ( <div> { / *
	this.state.ClientsByPage.map( (item, counter) => (
			<tr >
				<td>{ item.denominacionEntidad.toUpperCase() }</td>
				<td>{ item.denominacionSubEntidad.toUpperCase() }</td>
				<td>&nbsp;</td>
				<td><input type="checkbox" name="chk_" /></td>
			</tr>
		)
	)
* / }

{ 
{ / *  
		<input type="checkbox" name="chk_' + planilla[i].codigoPersona +'" id="chk_' + planilla[i].codigoPersona +'" value="'+ (parseInt(planilla[i].habilitado) === 1 ? 1 : 0) +'" '+ (parseInt(planilla[i].habilitado) === 1 ? 'checked' : '') +' onChange="cambiarEstado(' + planilla[i].codigoPersona + ');" />
		* / }   
							
		<td style="text-align:left;padding-left:10px;" onClick="mostrarVentanaEditarModal(\'' + planilla[i].codigoPersona + '\', \'' + planilla[i].nombre + '\', \'' + planilla[i].apellidoPaterno + '\', \'' + planilla[i].apellidoMaterno + '\');" >

		{ planilla[i].apellidoPaterno.toUpperCase() + ' ' + planilla[i].apellidoMaterno.toUpperCase() + ', ' +  planilla[i].nombre } 
		</td>
								<td>
									<input type="checkbox" name="chk_' + planilla[i].codigoPersona +'" id="chk_' + planilla[i].codigoPersona +'" value="'+ (parseInt(planilla[i].habilitado) === 1 ? 1 : 0) +'" '+ (parseInt(planilla[i].habilitado) === 1 ? 'checked' : '') +' onChange="cambiarEstado(' + planilla[i].codigoPersona + ');" />
								</td>
							
* / }
						</tbody>
					</table>
				</main>

				// var clients__ = this.state.ClientsList.map( (i) => { return ( <option value={i.codigoEntidad} selected={this.state.CLIENT_ENTITY === i.codigoEntidad ? true : false }>{i.denominacionEntidad}</option> ); });

{ /* <!-- BEGIN append form --> * / }
<div id="ventanaAgregarPersonal" class="overbox">
	<div class="content">            
		<button onClick="ocultarVentanaAgregarPersonal();">Cerrar &times;</button>
		<br /><br />
		<hr /> 
		<br />

		<form>
			<label>Tipo de Documento : </label><br />
			<select name="tipoDoc_" id="tipoDoc_">
			{/* <script type="text/javascript">              
				tiposDocumentos.map( e => {
					document.writeln( `<option value="${e.id}">${e.denominacion}</option>` );
				}); 
				</script> * / }
			</select><br />
			<br />
			<label>Documento de Identidad : </label><br />
			<input type="text" name="documento_" id="documento_" required /><br />
			<br />
			<label>Nombres : </label><br />
			<input type="text" name="nombre_" id="nombre_" required /><br />
			<br />
			<label>Apellido Paterno : </label><br />
			<input type="text" name="apPaterno" id="apPaterno" required /><br />
			<br />
			<label>Apellido Materno : </label><br />
			<input type="text" name="apMaterno" id="apMaterno" /><br />
			<br />

			<br /><hr /><br />
			<div style={{textAlign:'right'}}><input type="button" value="Registrar +" onClick="agregarPersona();" /></div>
		</form>
	</div>
</div>
{ /* <!-- END append form --> * / }


{ /* <!-- BEGIN edit form --> * / }
<div id="edtNomAp" class="overbox">
	<div class="content">    
		<a href="javascript:ocultarVentanaAEditarModal();">Cerrar</a>
		<br />
		<br />
		<br />
		<label>Nombres : </label><br />
		<input type="text" name="nombreEdt_" id="nombreEdt_" required /><br />
		<br />
		<label>Apellido Paterno : </label><br />
		<input type="text" name="apPaternoEdt_" id="apPaternoEdt_" required /><br />
		<br />
		<label>Apellido Materno : </label><br />
		<input type="text" name="apMaternoEdt_" id="apMaternoEdt_" /><br />
		<br />
		<input type="hidden" name="idPersonaEdt_" id="idPersonaEdt_" />
		
		<input type="button" value="Actualizar &rarr;" onClick="editarDenominacionPersona();" />
	</div>
</div>
{ /* <!-- END edit form --> * / }

			</div>
			);
		}
	}
}   
*/
/* HOT NATURED -- BENEDICTION */