import { authenticationService } from '../services';

export function handleLoginResponse(response) {
    return response.text().then(text => {
        const data = isJson(text)
            ? JSON.parse(text)
            : text;
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                window.location.reload(true);
            }
                const error = isJson(data)
                ? JSON.parse(data)
                : data;
            if (!error || error.length == 0 || (response.statusText && response.statusText.length > 0))
                error = response.statusText;
                return Promise.reject(error);
        }

        return data;
    });
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
}

export function handleResponse(response) {
    return response.text().then(text => {

        const data = isJson(text)
            ? JSON.parse(text)
            : text;

        if (!response.ok) {
            if ([400].indexOf(response.status) !== -1) {
                window.location.href = "/badRequest";
            }

            if ([401].indexOf(response.status) !== -1) {
                window.location.href = "/unauthorized";
            }

            if ([403].indexOf(response.status) !== -1) {
                window.location.href = "/forbidden";
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}