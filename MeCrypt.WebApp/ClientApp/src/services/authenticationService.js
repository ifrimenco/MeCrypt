import { BehaviorSubject } from 'rxjs'; // observable design pattern

import {encryptionService} from './index'
import { handleLoginResponse, permissionTypes } from '../helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const privateKeySubject = new BehaviorSubject(localStorage.getItem('privateKey'));



export const authenticationService = {
    login,
    logout,
    register,
    currentUser: currentUserSubject.asObservable(),
    hasPermission(permission) {
        if (currentUserSubject.value === null) return false;

        return (currentUserSubject.value.permissions.find(number => number === permission));

    },

    get hasUserEditingPermission() {
        if (currentUserSubject.value === null) return false;

        return (currentUserSubject.value.permissions.find(number => number === permissionTypes.Users_Update));
    },
    get currentUserValue() { return currentUserSubject.value; },
    get privateKey() {
        return privateKeySubject.value;
    }
};

async function login(email, password) {
    var key = await encryptionService.getNewKey();

    let publicKey = await encryptionService.exportPublicKey(key.publicKey);
    let privateKey = await encryptionService.exportPrivateKey(key.privateKey);

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


function register(email, password, firstName, lastName) {
    var key = encryptionService.getNewKey();
    var publicKey = key[0];
    var privateKey = key[1];

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