import React from 'react';

export class Logout extends React.Component {
	componentDidMount() {
		window.sessionStorage.clear(); // Destroy session -- destroy tokens
	}

	render () {
		return (
			 <div className="z">
                <div>
					<h1>Confirmada su salida</h1>
					<h2><a href="/_" className="x">&lt; Para continuar, cliqueé aquí &gt;</a></h2>
				</div>
			</div>
		)
	}
}

export default Logout