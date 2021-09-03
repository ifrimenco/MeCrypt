import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { usersService } from '../services'

export class C extends Component {
    static displayName = UsersPage.name;

    constructor(props) {
        super(props);
        this.state = { users: [], loading: true };
    }

    async componentDidMount() { // se apeleaza prima oara cand apare componenta pe ecran 
        await this.populateUserData();
    }

    componentDidUpdate() { // se apeleaza de fiecare data cand se modifica props

    }

    static renderUsersTable(users) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td><Link to={`/editUser/${user.id}`}><button className="editButton"></button></Link></td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : UsersPage.renderUsersTable(this.state.users);

        return (
            <div>
                <h1 id="tabelLabel" >Users</h1>
                {contents}
            </div>
        );
    }

    async populateUserData() {
        const data = await usersService.getUsers();
        this.setState({ users: data, loading: false });
    }
}
