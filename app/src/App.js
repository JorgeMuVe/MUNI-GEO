import React from 'react';
import { BrowserRouter , Route , Switch } from 'react-router-dom';
import { Error404 } from './component/Error404.js';
import { MainPage } from './view/MainPage.js';
import { Login } from './view/Login_/Login_.js';
import { Logout } from './view/Logout_/Logout_.js';
import { ChangePassword } from './view/Password_/Password_.js';
import { Client } from './view/Client_/Client_.js';
import { GarbageRoute } from './view/Route_/Route_.js';
import { Schedule } from './view/Schedule_/Schedule_.js';
import { Operator } from './view/Operator_/Operator_.js';
import { Vehicle } from './view/Vehicle_/Vehicle_.js';
import { Device } from './view/Device_/Device_.js';
import { WayPoint } from './view/WayPoint_/WayPoint_.js';

class App extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={ Login } />
                        <Route exact path="/_" component={ MainPage } />
                        <Route exact path="/logout" component={ Logout } />
                        <Route exact path="/password" component={ ChangePassword } />
                        <Route exact path="/client" component={ Client } />
                        <Route exact path="/route" component={ GarbageRoute } />
                        <Route exact path="/personal" component={ Operator } />
                        <Route exact path="/vehicle" component={ Vehicle } />
                        <Route exact path="/device" component={ Device } />
                        <Route exact path="/schedule" component={ Schedule } />
                        <Route exact path="/trajectory/manual/:id" component={ WayPoint } />
                        <Route exact path="/*" component={ Error404 }/>
                    </Switch> { /* */ }
                    </BrowserRouter> { /* */ }
                </div>
            </div>
        )
    }
}
export default App;