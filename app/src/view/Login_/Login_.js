import React from 'react';
import { hex_sha1 } from '../../model/sha1.js';
import { tryCredentialsTologin } from '../../model/SessionModel_.js';
import jwt_decode from 'jwt-decode';
//import { cipher } from '../../model/cypher.js';  //, decipher

export class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
    		user: '',
    		password: '', 
    		encryptedUser : '',
    		encryptedPassword : '',
    	};	
	}
	
	sendCredentialsToLogin = (event) => {
		event.preventDefault();
		if ((this.state.user.trim().length < 6) && (this.state.password.trim().length < 8)) {
			window.alert('Inténtelo de nuevo !,\r\ncon datos válidos');
			this.setState({ user:'', password:'' }, () => { document.getElementById('_a').focus(); });
		} else {
			this.setState({
				encryptedUser : hex_sha1(this.state.user.trim()),
				encryptedPassword : hex_sha1(this.state.password.trim()),
			}, () => { 
				tryCredentialsTologin({ usuario : this.state.encryptedUser, clave : this.state.encryptedPassword }).then( r =>{
					if (!r.error) {
						console.log(r);
						// console.log(r.length);
						if ('tokenSession' in r) {
							window.sessionStorage.clear();
							window.sessionStorage.setItem('x-access-token', r.tokenSession);
							window.sessionStorage.setItem('x-access-token-expiration', Date.now() + 2 * 60 * 60 * 1000);
							//tokenPrevioslySaved -- verficar que no sea NULL???
							const data2decode = jwt_decode(r.tokenSession);					
							// const myCipher = cipher('mySecretSalt');
							// window.sessionStorage.setItem('id', data2decode.id);
							window.sessionStorage.setItem('idClient', data2decode.idClient);
							window.sessionStorage.setItem('label', data2decode.label);
							window.sessionStorage.setItem('role', data2decode.role);
							window.sessionStorage.setItem('eSignSession', data2decode.eSignSession);
							window.sessionStorage.setItem('labelClient', data2decode.labelClient);
							// Client ID to process 	
							window.sessionStorage.setItem('ClientCode', 0);
							window.sessionStorage.setItem('RouteCode', 0);
							window.sessionStorage.setItem('ScheduleCode', 0);
							window.sessionStorage.setItem('TrajectoryCode', 0);
							// console.log( window.sessionStorage.getItem('x-access-token') );
							window.location.href = '/_'; // window.history.replaceState({}, null, '/route'); -- this.props.history.push('/u1');
						} else {
							window.alert('Problemas con el servidor,\r\nInténtelo más tarde !');
						}
					} else {
						window.alert('Las credenciales provistas para\r\n autenticarse NO SON VÁLIDAS !');
						this.setState({ user:'', password:'' }, () => { document.getElementById('_a').focus(); });
					}
				});
			});
		}	
	}

	render () {
		return (
			<div className="z">
				<form>					
					<div>
						<h1 style={{textAlign:'right'}}> Geo/garbage <span style={{color:'slategray',fontSize:'50%'}}>v0.1.4</span></h1>
						<br />
						
						<input type="email" placeholder="Username @" value={this.state.user} size={40} id="_a" autoFocus required onChange={(event) => { this.setState({user: event.target.value});}} />
						<br />
						<br />					
						
						<input type="password"  placeholder="Password" value={this.state.password} size={40} onChange={(event) => { this.setState({password: event.target.value});}} />
						<br />
						<br />

						<button onClick={this.sendCredentialsToLogin}>Ingresar &rarr;</button>
					</div>
				</form>
			</div>
		);
	}
}

export default Login;