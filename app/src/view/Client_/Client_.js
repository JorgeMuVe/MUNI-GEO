import React from 'react';
import { 
        getTotalClients, 
        getListOfClientsByPage, 
        setEnabledStatusPerClient, 
        addNewClient, 
        setupLabelsClient 
    } from '../../model/ClientModel_.js';
import GlobalHeader from '../../component/GlobalHeader.js';
import ModulesTitle from '../../component/ModulesTitle.js';
import { isAuthenticated } from '../../model/SessionModel_.js';

const ITEMSxPAGE = 10;

export class Client extends React.Component {
    constructor(props) { 
        super(props);
        this.state = { 
            ClientsByPage : [],
            totalItems : 1, 
            numberOfPage : 1, 
            totalPages : 0,
            userAuthenticated : false,
        };
    }

    getTotalItems = () => {
        getTotalClients().then( r => {
            if ('total' in r) {
                const totalClients_ = parseInt( r.total );
                this.setState({ 
                    totalItems : totalClients_,
                    totalPages : parseInt(totalClients_ / ITEMSxPAGE) + (parseInt(totalClients_ % ITEMSxPAGE) !== 0 ? 1 : 0)
                });
            }
        });
    }

    decreaseNumberOfPage = () => {
        this.setState({
            numberOfPage : ( parseInt(this.state.numberOfPage) > 1 ? parseInt(this.state.numberOfPage) - 1 : 1)
        }, () => { this.populateListOfClients() });
    }

    increaseNumberOfPage = () => {
        this.setState({
            numberOfPage : ( parseInt(this.state.numberOfPage) < this.state.totalPages ? parseInt(this.state.numberOfPage) + 1 : this.state.totalPages)
        }, () => { this.populateListOfClients() });
    }

    changeNumberOfPage = (event) => {
        const n = event.target.value;
        this.setState({
            numberOfPage : (parseInt(n) > 0 && parseInt(n) <= this.state.totalPages) ? n : 1,
        }, () => { this.populateListOfClients() });       
    }

    setEnabledStatus = (event) => {
        const SendThisData = {
            cliente : parseInt(window.sessionStorage.getItem('idClient')),
            codigo : parseInt(event.target.dataset.id),
            estado : parseInt(event.target.value) === 1 ? 0 : 1,
            firma : window.sessionStorage.getItem('eSignSession'),
        };
        setEnabledStatusPerClient( SendThisData ).then( r => { this.populateListOfClients(); });
    }

    showModalToAddClient = () => {
        document.getElementById('wnd2Add').style.display='block';
        document.getElementById('darkBackground').style.display='block';
        document.getElementById('n_').value = '';
        document.getElementById('m_').value = '';
        document.getElementById('n_').focus();
    }

    hideModalToAddClient = () => {
        document.getElementById('wnd2Add').style.display='none';
        document.getElementById('darkBackground').style.display='none';
    }

    showModalToEditClient = (event) => {
        const tmpIdClient = event.target.dataset.id;
        const hiddenValue = event.target.dataset.n2;
        const txtValueOnClick = event.target.innerText;
        document.getElementById('o2_').value = tmpIdClient;
        if (parseInt(event.target.dataset.n1) === 1) {
            document.getElementById('n2_').value = txtValueOnClick;
            document.getElementById('m2_').value = hiddenValue;                         
        } else {
            document.getElementById('n2_').value = hiddenValue;
            document.getElementById('m2_').value = txtValueOnClick;
        }
        document.getElementById('wnd2Edit').style.display='block';
        document.getElementById('darkBackground').style.display='block';
        document.getElementById('n2_').focus();
    }

    hideModalToEditClient = () => {
        document.getElementById('wnd2Edit').style.display='none';
        document.getElementById('darkBackground').style.display='none';
    }

    addClient = () => {
        this.hideModalToAddClient();
        const n1 = document.getElementById('n_').value;
        const n2 = document.getElementById('m_').value;
        if (n1.trim().length > 3 ) { // TODO - Make better validation here
            const sendThisData4Append = {
                cliente : parseInt(window.sessionStorage.getItem('idClient')), 
                nombre1 : n1.trim(),
                nombre2 : n2.trim(),
                firma : window.sessionStorage.getItem('eSignSession'),
            };
            addNewClient( sendThisData4Append ).then( r => { 
                /* this.populateListOfClients(); */
            });
            this.setState({ numberOfPage : 1, }, () => { this.populateListOfClients(); });
        } else {
            window.alert('El nombre del Cliente\r\nDebe ser más descriptivo\r\nInténtelo de nuevo!');
        }
    }

    updateClientData = () => {
        this.hideModalToEditClient();
        const sendJson2Update = {
            cliente : parseInt(window.sessionStorage.getItem('idClient')), 

            codigo : document.getElementById('o2_').value,

            nombre1 : document.getElementById('n2_').value,
            nombre2 : document.getElementById('m2_').value,
            firma : window.sessionStorage.getItem('eSignSession'),
        };
        setupLabelsClient( sendJson2Update ).then( r => {
            this.populateListOfClients();
        });
    }

    goCheckRoute = (event) => {
        const link_ = event.target.dataset.id;
        window.sessionStorage.setItem('ClientCode', link_);
        window.location.href = '/route'; 
    }

    componentDidMount() {
        if ( !isAuthenticated() ) {
            window.location.href = '/';
        } else {
            this.setState({ userAuthenticated : true }, () => {
                this.getTotalItems();
                this.populateListOfClients();
            });    
        }
    }

    populateListOfClients = () => {
        var offset_ = (parseInt(this.state.numberOfPage) - 1) * ITEMSxPAGE;
        getListOfClientsByPage( offset_, ITEMSxPAGE ).then( r => {
            //if ('total' in r) {
                this.setState({ ClientsByPage : r, });
            //}
        });
    }
    
    render() {
        if (!this.state.userAuthenticated) {
            return (
                <div className="z"> 
                    <h1>Acceso denegado</h1>
                </div> 
            );
        } else {
            if ( this.state.ClientsByPage.length > 0) { 
                return (
                    <div>
                        <GlobalHeader />
                        <ModulesTitle text="Clientes/Entidades" />
                        <br />
                        <br />
                        <nav>
                            <input type="button" name="prv_" value="&larr;" onClick={this.decreaseNumberOfPage} title="Página anterior" />
                                    
                            <input type="number" name="pagina_" id="pagina_" min="1" pattern="[0-9]*" title="Número de Página" onChange={this.changeNumberOfPage} style={{textAlign:'center',border:'none',width:'4em'}} value={this.state.numberOfPage} />&nbsp;&nbsp;de&nbsp;&nbsp;
                    
                            <input type="text" name="totalEntidad_" id="totalEntidad_" size="2" style={{border:'none'}} title="Total de páginas a mostrar" value={this.state.totalPages} readOnly /> 
                                
                            <input type="button" name="nxt_" value="&rarr;" onClick={this.increaseNumberOfPage} title="Página siguiente" />

                            &nbsp;&nbsp;&nbsp;<button onClick={this.showModalToAddClient} title="Registra un NUEVO CLIENTE / Empresa / Entidad">Entidad +</button>
                        </nav>
                        <br />

                <main>
                    <table>
                        <thead><tr>
                            <th style={{width:'40%'}}>&nbsp;Nombre de Entidad&nbsp;</th>
                            <th style={{width:'40%'}}>Oficina/Sub-sede/Gerencia</th>
                            <th style={{width:'10%'}}>&nbsp;</th>
                            <th title="¿está el operador habilitado?">&nbsp;</th>
                        </tr></thead>
                        <tbody>
                        {
                            this.state.ClientsByPage.map( item => (
                                <tr key={'clt_' + item.codigoEntidad}>
                                    <td>
                                        <span onClick={this.showModalToEditClient} data-id={item.codigoEntidad} data-n1={1} data-n2={item.denominacionSubEntidad}>{ item.denominacionEntidad.toUpperCase() }</span>
                                    </td>
                                    <td>
                                        <span onClick={this.showModalToEditClient} data-id={item.codigoEntidad} data-n1={2} data-n2={item.denominacionEntidad}>{ item.denominacionSubEntidad.toUpperCase() }</span>
                                    </td>
                                    <td>
                                        &nbsp;<span onClick={this.goCheckRoute} data-id={item.codigoEntidad} title="Ver listado de Rutas de Recolección del Cliente" style={{backgroundColor:'transparent',textDecoration:'none', border:'none', cursor:'pointer'}}>&#x25B7;</span>{ /* &#x25A1; */ }
                                    </td>
                                    <td>
                                        { /* <label className="btn-enable"> */ }
                                            <input type="checkbox" data-id={item.codigoEntidad}
                                                name={'chk_'+item.codigoEntidad}
                                                id={'chk_'+item.codigoEntidad}
                                                value={ parseInt(item.habilitado) === 1 ? 1 : 0 }
                                                checked={ parseInt(item.habilitado) === 1 ? true : false }
                                                onChange={this.setEnabledStatus}
                                                title="Habilitar/Deshabilitar al Cliente" />
                                            { /* <div className="btn-slice circle"></div> 
                                        </label> */ }
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </main>



                <div id="wnd2Add" className="overbox">
                    <div className="content">            
                        <button onClick={this.hideModalToAddClient}>Cerrar &times;</button><br /><br />
                        <hr /><br />
                        <form name="appendForm">
                            <fieldset><legend>Nombre del Cliente</legend>
                            { /* <label htmlFor="n_">Nombre del Cliente</label><br /> */ }
                            <input type="text" name="n_" id="n_" placeholder="Nombre del Cliente/Empresa" title="Ingrese Nombre del Cliente/Empresa" required size="45" />
                            </fieldset>
                            <br />
                            
                            <fieldset><legend>Nombre de la Oficina de contacto</legend>
                            { /* <label htmlFor="m_">Nombre de la Oficina de contacto</label><br /> */ }
                            <input type="text" name="m_" id="m_" placeholder="Nombre de Oficina/Gerencia " size="45" /><br />
                            </fieldset>

                            <br /><hr /><br />
                            <div style={{textAlign:'right'}}><input type="button" value="Agregar/Registrar +" onClick={this.addClient} /></div>
                        </form>
                    </div>
                </div>



                <div id="wnd2Edit" className="overbox">
                    <div className="content">
                        <button onClick={this.hideModalToEditClient}>Cerrar &times;</button><br /><br />
                        { /* */ }              
                        <hr /><br />
                        <form>
                        <input type="hidden" name="o2_" id="o2_" />

                        <fieldset><legend>Nombre del Cliente</legend>
                        <input type="text" name="n2_" id="n2_" placeholder="Nombre del Cliente/Empresa" title="Ingrese Nombre del Cliente/Empresa" required size="45" /><br />
                        </fieldset>
                        <br />
                        
                        <fieldset><legend>Nombre de Oficina/Gerencia</legend>
                        <input type="text" name="m2_" id="m2_" placeholder="Nombre de Oficina/Gerencia" required size="45" /><br /></fieldset>
                        <br />

                        <br /><hr /><br />
                        <div style={{textAlign:'right'}}><input type="button" value="Actualizar &rarr;" onClick={this.updateClientData} /></div>
                        </form>
                    </div>            
                </div>
                    
                <div id="darkBackground" className="fadebox">&nbsp;</div>
            </div>
            )   
        } else {
            return (
            <div> 
                <GlobalHeader></GlobalHeader>
                <br />
                <br />
                <br /> 
                <main>       
                    NO existen datos &nbsp; <button onClick={this.showModalToAddRoute}>Ruta +</button>
                </main>

                <div id="darkBackground" className="fadebox">&nbsp;</div>
            </div>);
        }   
        }  
    }
}

export default Client;
// &#128279;