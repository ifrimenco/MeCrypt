import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

import { authenticationService } from '../services';

export const NavMenu = (props) => {

    const [currentUserValue, setCurrentUserValue] = React.useState(authenticationService.currentUserValue);

    const onLogout = () => {
        authenticationService.logout();
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/">MeCrypt</NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        {currentUserValue ?
                            <NavItem>
                                <NavLink tag={Link} onClick={onLogout} className="text-dark" to="/">Logout</NavLink>
                            </NavItem>
                            :
                            <>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/loginPage">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/registerPage">Register</NavLink>
                                </NavItem>
                            </>}
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                        </NavItem>
                    </ul>
                </Container>
            </Navbar>
        </header>
    );
}
