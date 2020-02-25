import React from 'react';
import GlobalHeader from '../../component/GlobalHeader.js';
import { isAuthenticated } from '../../model/SessionModel_.js';

export class ChangePassword extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            userAuthenticated : false,
        }
    }

	componentDidMount() {
        if ( !isAuthenticated() ) {
            window.location.href = '/';
        } else {
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
	            <br />

				{ /* <div className="z"> */ }
					<div style={{paddingLeft:'10px'}}>
						<fieldset style={{width:'30%'}}>{ /* <label htmlFor="">Actual contraseña</label><br /> */ }
						<legend>Actual&nbsp;&nbsp;contraseña</legend>
							<input type="password" placeholder="Actual contraseña" autofocus required size="30" />
						</fieldset><br />

						<fieldset style={{width:'30%'}}>{ /* <label htmlFor="">Nueva contraseña</label><br /> */ }
						<legend>Nueva&nbsp;&nbsp;contraseña</legend>
						<input type="password" placeholder="Nueva contraseña" size="30" />
						</fieldset><br />

						<fieldset style={{width:'30%'}}>{ /* <label htmlFor="">Reingrese la nueva contraseña</label><br /> */ } 
						<legend>Reingrese la nueva contraseña</legend>
						<input type="password" placeholder="Reingrese la nueva contraseña" size="30" />
						</fieldset><br /><br />

						<button onClick={this.updatePassword}>Actualizar mi contraseña &rarr;</button>	
					</div>
				{ /*  </div> */ }
			</div>
			)
		}
	}
}

export default ChangePassword


/* 
    <div className="t3" style={{verticalAlign:'bottom', lineHeight:'30px'}}>
    fill="#676767" 

<svg viewBox="0 0 24 24" width="24px" height="24px" id="ic_chevron_left_black_24dp" onClick={window.history.back()}>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" stroke="slategray" />
    <path d="M0 0h24v24H0z" fill="transparent" />
</svg>

    <span className="t4">Cambiar la contraseña</span>

<svg viewBox="0 0 24 24" width="24px" height="24px" id="ic_chevron_right_black_24dp" onClick={window.history.forward()}>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" stroke="slategray" />
    <path d="M0 0h24v24H0z" fill="transparent" />
</svg>

    </div>
*/