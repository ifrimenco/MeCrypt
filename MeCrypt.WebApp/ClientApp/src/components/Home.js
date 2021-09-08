import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { authenticationService } from '../services';
import { permissionTypes } from '../helpers';


export const Home = () => {
    const currentUserValue = React.useRef(authenticationService.currentUserValue);
    const hasUserEditingPermission = React.useRef(authenticationService.hasUserEditingPermission);
    const hasSecretsDealingPermission = React.useRef(authenticationService.hasPermission(permissionTypes.Secrets_Deal));
    const hasSecretsOpeningPermission = React.useRef(authenticationService.hasPermission(permissionTypes.Secrets_Open));

    React.useEffect(() => {
        console.log(hasUserEditingPermission);
        console.log(hasSecretsOpeningPermission);
        console.log(hasSecretsOpeningPermission);
    });
    return (
        <div class="homeContainer">
            <h1>MeCrypt</h1>
            {currentUserValue.current
                ?
                <>
                    <div class="notLoggedIn">
                        <Link to={`/chat`}><button className="btn notLoggedButton btn-outline-dark"><h4>Chat</h4></button></Link>

                        {hasSecretsDealingPermission.current && <Link to={`/createSecret`}><button className="btn notLoggedButton btn-outline-dark"><h4>Create Secret</h4></button></Link>}
                        {hasSecretsOpeningPermission.current && <Link to={`/secretsPage`}><button className="btn notLoggedButton btn-outline-dark"><h4>View Secrets</h4></button></Link>}
                        {hasUserEditingPermission.current && <Link to={`/adminPage`}><button className="btn notLoggedButton btn-outline-dark"><h4>Admin Page</h4></button></Link>}
                    </div>
                </>
                :
                <div class="notLoggedIn">
                    <Link to={`/login`}><button className="btn notLoggedButton btn-outline-dark"><h4>Login</h4></button></Link>
                    <Link to={`/register`}><button className="btn notLoggedButton btn-outline-dark"><h4>Register</h4></button></Link>
                </div>
            }
        </div>
    );

}
