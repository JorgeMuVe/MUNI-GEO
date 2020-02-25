import React from 'react';

var FONT_SIZE = 1;

export class GlobalHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subMenuDisplayed : false,
        }
    }

    onHome = () => {
        window.location.href = '/_';
    }

    zoomIn = () => { 
        FONT_SIZE += 0.1; 
        document.body.style.fontSize = FONT_SIZE + "em"; 
    }
    
    zoomOut = () => { 
        FONT_SIZE -= 0.1; 
        document.body.style.fontSize = FONT_SIZE + "em"; 
    }

    showMenu = () => {
        this.setState({
            subMenuDisplayed : !this.state.subMenuDisplayed,
        }, () => {
            if (this.state.subMenuDisplayed) {
                document.getElementById('sm_').style.display = 'block';    
            } else {
                document.getElementById('sm_').style.display = 'none';
            }
        });
    }

    render() {
        return (
        <div>
            <div className="t1">
                { /*  */ }
                <h1>&nbsp;<span className="u" onClick={this.showMenu}>&#8801;</span>&nbsp;&nbsp;<span onClick={this.onHome}>Geo/CityGarbage</span> <span className="v"> Collector v0.1.4</span></h1>
            </div>

            <div className="m" id="sm_">
                <div className="n" style={{padding:'6px 5%'}}><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 21h8.033v-2l1-1v4h-9.033v2l-10-3v-18l10-3v2h9.033v5l-1-1v-3h-8.033v18zm-1 1.656v-21.312l-8 2.4v16.512l8 2.4zm11.086-10.656l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z"/></svg>&nbsp;&nbsp;<a className="p2" href="/logout">Salir/Cerrar sesión</a></div>
                { /* <div className="n" style={{padding:'6px 5%'}}><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M16 1c-4.418 0-8 3.582-8 8 0 .585.063 1.155.182 1.704l-8.182 7.296v5h6v-2h2v-2h2l3.066-2.556c.909.359 1.898.556 2.934.556 4.418 0 8-3.582 8-8s-3.582-8-8-8zm-6.362 17l3.244-2.703c.417.164 1.513.703 3.118.703 3.859 0 7-3.14 7-7s-3.141-7-7-7c-3.86 0-7 3.14-7 7 0 .853.139 1.398.283 2.062l-8.283 7.386v3.552h4v-2h2v-2h2.638zm.168-4l-.667-.745-7.139 6.402v1.343l7.806-7zm10.194-7c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm-1 0c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1z"/></svg>&nbsp;&nbsp;<a className="p2" href="/password">Cambiar mi contraseña</a></div>
                <div className="n"><br /><span className="p2" style={{FONT_SIZE:'24pt'}} onClick={this.zoomOut}>&mdash;</span> { / * Tamaño de Fuente * / } / <span className="p" style={{FONT_SIZE:'24pt'}} onClick={this.zoomIn}>+</span></div> */}
            </div>

            <header className="t2">
                <hgroup style={{padding:'10px 10px'}}>
                <div style={{minWidth:'2%', float:'left'}}>
                    <svg width='48px' height='48px' viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff" /><path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </div>
                <div style={{verticalAlign:'top',color:'#fff'}}>
                    <span style={{fontSize:'150%',fontWeight:'bold'}}>{ window.sessionStorage.getItem('label') }</span><br />
                    { window.sessionStorage.getItem('labelClient') } 
                </div>
                </hgroup>
            </header>

        </div>
        );
    }
}

export default GlobalHeader;