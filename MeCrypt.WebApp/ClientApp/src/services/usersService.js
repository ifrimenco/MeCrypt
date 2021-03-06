import { authHeader, handleResponse } from '../helpers';

export const usersService = {
    getUsers,
    getSingleUser
};

async function getUsers() {
    const requestOptions = { method: 'GET', headers: authHeader() };

    const data = await fetch('users/getUsers', requestOptions)
        .then(handleResponse);

    return data;
}

async function getSingleUser(userId) {
    const requestOptions = { method: 'GET', headers: authHeader() };

    const response = await fetch('users/GetSingleUser', requestOptions)
        .then(handleResponse);

    return response;
}
