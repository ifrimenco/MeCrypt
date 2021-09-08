import { BehaviorSubject } from 'rxjs'; // observable design pattern

import {encryptionService} from './index'
import { authHeader, handleLoginResponse, permissionTypes } from '../helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const privateKeySubject = new BehaviorSubject(localStorage.getItem('privateKey'));
const publicKeySubject = new BehaviorSubject(localStorage.getItem('publicKey'));



export const authenticationService = {
    login,
    logout,
    register,
    currentUser: currentUserSubject.asObservable(),
    hasPermission,

    get hasUserEditingPermission() {
        if (currentUserSubject.value === null) return false;

        return (currentUserSubject.value.permissions.find(number => number === permissionTypes.Users_Update));
    },
    get currentUserValue() { return currentUserSubject.value; },
    get privateKey() {
        return privateKeySubject.value;
    },
    get publicKey() {
        return publicKeySubject.value;
    }
};

function hasPermission(permission) {
    if (currentUserSubject.value === null) return false;
    return (currentUserSubject.value.permissions.find(number => number === permission));

}
async function login(email, password) {
    var key = await encryptionService.getNewKey();

    let publicKey = await encryptionService.exportPublicKey(key.publicKey);
    let privateKey = await encryptionService.exportPrivateKey(key.privateKey);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, publicKey })
    };

    return fetch(`https://localhost:44358/UserAccount/Login`, requestOptions)
        .then(handleLoginResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('privateKey', privateKey);
            localStorage.setItem('publicKey', publicKey);
            currentUserSubject.next(user);

            return user;
        });
}


async function register(email, password, firstName, lastName) {
    var key = await encryptionService.getNewKey();

    let publicKey = await encryptionService.exportPublicKey(key.publicKey);
    let privateKey = await encryptionService.exportPrivateKey(key.privateKey);


    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, publicKey })
    };

    return fetch(`https://localhost:44358/UserAccount/Register`, requestOptions)
        .then(handleLoginResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('privateKey', privateKey);
            localStorage.setItem('publicKey', publicKey);
            currentUserSubject.next(user);

            return user;
        });
}
async function logout() {
    // remove user from local storage to log user out
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    }

    const response = await fetch(`https://localhost:44358/UserAccount/logout`, requestOptions);
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
    return response;
}