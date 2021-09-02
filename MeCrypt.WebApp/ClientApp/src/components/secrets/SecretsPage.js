import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { secretsService } from '../../services'

export const SecretsPage = () => {
    const [secrets, setSecrets] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            const secrets = await secretsService.getSecrets();
            setSecrets(secrets);

            setLoading(false);
        }

        fetchData();
    });

    return (
        loading
            ? <p><em>Loading...</em></p>
            :
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {secrets.map(secret =>
                        <tr key={secret.id}>
                            <td>{secret.title}</td>
                            <td><Link to={`/openSecret/${secret.id}`}><button className="viewButton"></button></Link></td>
                        </tr>
                    )}
                </tbody>
            </table>
    );

}
