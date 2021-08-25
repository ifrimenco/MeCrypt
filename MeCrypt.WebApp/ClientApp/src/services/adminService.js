import { authHeader, authHeaderWithJson } from '../helpers';

import { handleResponse } from '../helpers';
export const adminService = {
    editUser,
    getRoles,
    getUser
};

async function editUser(user) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithJson(),
        body: JSON.stringify(user)
    };

    const response = await fetch(`admin/editUser/${user.id}`, requestOptions);
    return response;
}

async function getRoles() {
    const requestOptions = { method: 'GET', headers: authHeader() };

    const response = await fetch('admin/getRoles', requestOptions);
    return response;
}

async function getUser(userId) {
    const requestOptions = { method: 'GET', headers: authHeader() };

    const response = await fetch(`admin/getUser/${userId}`, requestOptions)
        .then(handleResponse);

    return response;
}