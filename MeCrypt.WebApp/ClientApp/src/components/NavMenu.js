import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { useHistory } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import './NavMenu.css';

import { authenticationService } from '../services';
import { permissionTypes } from '../helpers';


export const NavMenu = (props) => {

    const history = useHistory();
    const location = useLocation();
    const [currentUserValue, setCurrentUserValue] = React.useState(authenticationService.currentUserValue);
    const [hasUserEditingPermission, setHasUserEditingPermission] = React.useState(authenticationService.hasUserEditingPermission);
    const [hasMessagesPermission, setHasMessagesPermission] = React.useState(authenticationService.hasPermission(permissionTypes.Messages_ReadWrite));
    const [hasSecretsDealingPermission, setHasSecretsDealingPermission] = React.useState(authenticationService.hasPermission(permissionTypes.Secrets_Deal));
    const [hasSecretsOpeningPermission, setHasSecretsOpeningPermission] = React.useState(authenticationService.hasPermission(permissionTypes.Secrets_Open));

    const onLogout = async () => {
        await authenticationService.logout();
            window.location.reload();
    }

    React.useEffect(() => {
        setHasUserEditingPermission(authenticationService.hasUserEditingPermission);
        setHasMessagesPermission(authenticationService.hasPermission(permissionTypes.Messages_ReadWrite));
        setHasSecretsDealingPermission(authenticationService.hasPermission(permissionTypes.Secrets_Deal));
        setHasSecretsOpeningPermission(authenticationService.hasPermission(permissionTypes.Secrets_Open));
    }, [currentUserValue]);

    return (
        <header>
            <Navbar className="navbar navbar-expand-sm navbar-toggleable-sm ng-white border-bottom">
                <div class="container navbar-container">
                    <NavbarBrand tag={Link} to="/">MeCrypt</NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        {currentUserValue
                            ? <>
                                <div class="nav-item" id="no-hover">
                                    <b className="text-dark nav-link"><em>Welcome, {`${currentUserValue.firstName} ${currentUserValue.lastName}`}</em></b>
                                </div>
                                {hasUserEditingPermission
                                    ? <NavItem>
                                        <NavLink tag={Link} className="" to="/adminPage">Admin</NavLink>
                                    </NavItem>
                                    : <></>}
                                {hasMessagesPermission
                                    ? <NavItem>
                                        <NavLink tag={Link} className="" to="/chat">Chat</NavLink>
                                    </NavItem>
                                    : <></>}
                                {hasSecretsDealingPermission
                                    ? <NavItem>
                                        <NavLink tag={Link} className="" to="/createSecret">Create Secret</NavLink>
                                    </NavItem>
                                    : <></>}
                                {hasSecretsOpeningPermission
                                    ? <NavItem>
                                        <NavLink tag={Link} className="" to="/secretsPage">Secrets</NavLink>
                                    </NavItem>
                                    : <></>}
                                <NavItem>
                                    <NavLink tag={Link} onClick={onLogout} className="" to="/">Logout</NavLink>
                                </NavItem>
                            </>
                            :
                            <>
                                <NavItem>
                                    <NavLink tag={Link} className="" to="/login">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="" to="/register">Register</NavLink>
                                </NavItem>
                            </>}
                    </ul>
                </div>
            </Navbar>
        </header>
    );
}
