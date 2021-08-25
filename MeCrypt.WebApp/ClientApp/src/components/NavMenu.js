import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

import { authenticationService } from '../services';

export const NavMenu = (props) => {

    const [currentUserValue, setCurrentUserValue] = React.useState(authenticationService.currentUserValue);
    const [hasUserEditingPermission, setHasUserEditingPermission] = React.useState(authenticationService.hasUserEditingPermission);

    const onLogout = () => {
        authenticationService.logout();
        window.location.reload();
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/">MeCrypt</NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        {currentUserValue
                            ? <>
                                <NavItem>
                                    <p><em>Welcome, {`${currentUserValue.firstName} ${currentUserValue.lastName}`}</em></p>
                                </NavItem>
                                {hasUserEditingPermission
                                    ? <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/adminPage">Admin</NavLink>
                                    </NavItem>
                                    : <></>}
                                <NavItem>
                                    <NavLink tag={Link} onClick={onLogout} className="text-dark" to="/">Logout</NavLink>
                                </NavItem>
                            </>
                            :
                            <>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/loginPage">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/registerPage">Register</NavLink>
                                </NavItem>
                            </>}
                    </ul>
                </Container>
            </Navbar>
        </header>
    );
}
