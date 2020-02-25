import React from 'react';

export class Error404 extends React.Component {
    render() {
        return (
            <div className="z">
                <div>
                    <h1>ERROR 404</h1>
                    <h2><a href="/_" className="x">&lt; Para continuar, cliqueé aquí &gt;</a></h2>
                </div>
            </div>
        )
    }
}

export default Error404;