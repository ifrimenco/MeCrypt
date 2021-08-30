import { BehaviorSubject } from 'rxjs'; // observable design pattern


import { handleLoginResponse, permissionTypes } from '../helpers';

const keypair = require("keypair");

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    register,
    currentUser: currentUserSubject.asObservable(),
    get hasUserEditingPermission() {
        if (currentUserSubject.value === null) return false;

        return (currentUserSubject.value.permissions.find(number => number === permissionTypes.Users_Update));
    },
    get currentUserValue() { return currentUserSubject.value }
};

function login(email, password) {
    var key = getNewKey();
    var publicKey = key.publicKey;
    var privateKey = key.privateKey;
    debugger;
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
            currentUserSubject.next(user);

            return user;
        });
}
function getNewKey() { // creates a 2048-bits modulus RSA key
    var pair = keypair();
    return {
        privateKey: pair.private,
        publicKey: pair.public
    }
}
function register(email, password, firstName, lastName) {
    var key = getNewKey();
    var publicKey = key.publicKey;
    var privateKey = key.privateKey;
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
            currentUserSubject.next(user);

            return user;
        });
}
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}