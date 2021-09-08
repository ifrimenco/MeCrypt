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
    isEmail,
    isName,
    validatePassword,

    get hasUserEditingPermission() {
        if (currentUserSubject.value === null || currentUserSubject.value === "") return false;

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

function isEmail(email) {
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
};

function isName(name) {
    return /^[A-Za-z]-?[A-Za-z]?/.test(name);
};

function validatePassword(password) {
    return /^(?=.*[A-Z])$/.test(password) && /^[a-zA-Z0-9]{8,}$/.test(password);
};
function hasPermission(permission) {
    if (currentUserSubject.value === null || currentUserSubject.value === "") return false;
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
        }, error => { return Promise.reject(error)});
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