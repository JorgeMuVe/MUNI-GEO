import React from 'react';
import GlobalHeader from '../component/GlobalHeader.js'; 
import { isAuthenticated } from '../model/SessionModel_.js';

export class MainPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userAuthenticated : false,            
		}
	}
	
	goRoute = (event) => {
		const option_ = event.target.dataset.href;
		// if ( parseInt(window.sessionStorage.getItem('role')) !== 1 ) {    
		window.sessionStorage.setItem('ClientCode', parseInt(window.sessionStorage.getItem('idClient')));
		// }
		window.location.href = option_;
		// si soy administrador cambio directamente el PARAM TINTER PAGE
		// Si soy cliente es el mis rutas del IDCLIENT
		// Verificar que la pagina sea de   
	}

	componentDidMount() {
		if ( !isAuthenticated() ) {
			window.location.href = '/';
		} else {
			window.sessionStorage.setItem('ClientCode', 0); // reset values from sessionStorage
			window.sessionStorage.setItem('RouteCode', 0);
			this.setState({ userAuthenticated : true });
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
			return (
				<div>   
					<GlobalHeader></GlobalHeader>
					<br />
					<main>
						<br />
						<br />
						<ul style={{listStyleType:'none'}}>
							{ parseInt(window.sessionStorage.getItem('role')) === 1 && <li className="x" onClick={this.goRoute} data-href="/client">&lt; Módulo de Clientes/Empresas &gt;</li> } 
							
							{ /*parseInt(window.sessionStorage.getItem('role')) === 1 && <div><a className="x" href="../---">&lt; Módulo de Cuentas de Usuario &gt;</a><br /><br /></div> */ } 
							<li className="x" onClick={this.goRoute} data-href="/route">&lt; Módulo de Rutas &gt;</li>
							<li className="x" onClick={this.goRoute} data-href="/personal">&lt; Módulo de Personal &gt;</li>
							<li className="x" onClick={this.goRoute} data-href="/vehicle">&lt; Módulo de Vehículos &gt;</li>
							<li className="x" onClick={this.goRoute} data-href="/device">&lt; Módulo de Dispositivos &gt;</li>

							{ /* <li className="x" onClick={this.goRoute} data-href="/schedule">&lt; --- Módulo de Zonas, Horarios y Recursos &gt;</li>
							<li className="x" onClick={this.goRoute} data-href="/_">&lt; --- Módulo de Recorrido de Unidades &gt;</li> */ }
						</ul>
					</main>
				</div>
			)
		}
	}
}

export default MainPage;