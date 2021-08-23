import React, { Component } from 'react';
import { authHeader } from '../helpers';
export class UsersTable extends Component {
    static displayName = UsersTable.name;

    constructor(props) {
        super(props);
        this.state = { users: [], loading: true };
    }

    componentDidMount() { // se apeleaza prima oara cand apare componenta pe ecran 
        this.populateUserData();
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
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : UsersTable.renderUsersTable(this.state.users);

        return (
            <div>
                <h1 id="tabelLabel" >Users</h1>
                {contents}
            </div>
        );
    }

    async populateUserData() {
        const requestOptions = { method: 'GET', headers: authHeader() };
        const response = await fetch('admin', requestOptions);
        const data = await response.json();
        this.setState({ users: data, loading: false });
    }
}
