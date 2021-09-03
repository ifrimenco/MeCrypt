import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { UsersPage } from './components/UsersPage';
import { EditUser } from './components/EditUser';
import { LoginPage } from './components/Login';
import { RegisterPage } from './components/Register';
import { CreateSecret } from './components/secrets/CreateSecret';
import { OpenSecret } from './components/secrets/OpenSecret';
import { SecretsPage } from './components/secrets/SecretsPage';
import { CreateRoom } from './components/chat/CreateRoom';
import { Test } from './components/chat/Test';
import * as Errors from './components/DefaultPages';

import './static/styling/styling.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/fetch-data' component={FetchData} />
                    <Route path='/adminPage' component={UsersPage} />
                    <Route path='/loginPage' component={LoginPage} />
                    <Route path='/registerPage' component={RegisterPage} />
                    <Route path='/EditUser/:userId' component={EditUser} />
                    <Route path='/unauthorized' component={Errors.Unauthorized} />
                    <Route path='/forbidden' component={Errors.Forbidden} />
                    <Route path='/badRequest' component={Errors.BadRequest} />
                    <Route path='/secretsPage' component={SecretsPage} />
                    <Route path='/createSecret' component={CreateSecret} />
                    <Route path='/test' component={Test} />
                    <Route path='/openSecret/:secretId' component={OpenSecret} />
                    <Route path='/createRoom' component={CreateRoom} />
                    <Route path="*" component={Errors.NotFound} />
                </Switch>
            </Layout>
        );
    }
}
