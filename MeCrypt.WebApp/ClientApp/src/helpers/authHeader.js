import { authenticationService } from '../services';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;

    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    } else {
        return {};
    }
}

export function authHeaderWithJson() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;

    if (currentUser && currentUser.token) {
        return {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
        };
    } else {
        return {};
    }
}

