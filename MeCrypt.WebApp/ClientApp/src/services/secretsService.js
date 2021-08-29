import { authHeader, authHeaderWithJson } from '../helpers';

import { handleResponse } from '../helpers';

export const secretsService = {
    getSecrets,
    getSecret,
    createSecret
};

async function createSecret(content, title, userSecrets) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithJson(),
        body: JSON.stringify({ title, content, userSecrets })
    };

    debugger;
    const response = await fetch(`secrets/createSecret`, requestOptions);
    return response;
}

async function getSecrets() {
    const requestOptions = { method: 'GET', headers: authHeader() };

    const response = await fetch('secrets/getSecrets', requestOptions)
        .then(handleResponse);

    return response;
}

async function getSecret(secretId) {
    const requestOptions = { method: 'GET', headers: authHeader() };

    const response = await fetch(`secrets/getSecret/${secretId}`, requestOptions)
        .then(handleResponse);

    return response;
}