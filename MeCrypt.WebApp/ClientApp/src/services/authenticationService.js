import { BehaviorSubject } from 'rxjs'; // observable design pattern


import { handleLoginResponse, permissionTypes } from '../helpers';

// TODO - Cookies in loc de localStorage -- localStorage e unsafe
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    register,
    currentUser: currentUserSubject.asObservable(),
    get hasUserEditingPermission() { return [permissionTypes.Users_Update].indexOf(currentUserSubject.permissions) !== -1 },
    get currentUserValue() { return currentUserSubject.value }
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`https://localhost:44358/UserAccount/Login`, requestOptions)
        .then(handleLoginResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function register(email, password, firstName, lastName) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
    };

    return fetch(`https://localhost:44358/UserAccount/Register`, requestOptions)
        .then(handleLoginResponse) // TODO de redenumit handle login response
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}