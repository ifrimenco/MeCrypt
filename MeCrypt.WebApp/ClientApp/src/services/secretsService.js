import { authHeader, authHeaderWithJson } from '../helpers';

import { handleResponse } from '../helpers';

export const secretsService = {
    getSecrets,
    getSecretDetails,
    createSecret,
    openSecret
};

async function createSecret(content, title, minimumShares, userSecrets) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithJson(),
        body: JSON.stringify({ title, content, minimumShares, userSecrets })
    };


    const response = await fetch(`secrets/createSecret`, requestOptions);
    return response;
}

async function getSecrets() {
    const requestOptions = { method: 'GET', headers: authHeader() };

    const response = await fetch('secrets/getSecrets', requestOptions)
        .then(handleResponse);

    return response;
}

async function getSecretDetails(secretId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
        
    const response = await fetch(`secrets/getSecret/${secretId}`, requestOptions)
        .then(handleResponse);

    return response;
}

async function openSecret(secretId, shares) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithJson(),
        body: JSON.stringify({ secretId, shares })
    };

    const response = await fetch(`secrets/openSecret`, requestOptions)
        .then(handleResponse);
    return response;
}