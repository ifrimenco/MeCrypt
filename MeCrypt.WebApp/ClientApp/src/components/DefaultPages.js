import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
    <div>
        <h1>404 - Not Found!</h1>
        <Link to="/">
            Go Home
        </Link>
    </div>
);

export const Unauthorized = () => (
    <div>
        <h1>Whoopsie! 401 - Unauthorized</h1>
        <Link to="/">
            Go Home
        </Link>
    </div>
);

export const Forbidden = () => (
    <div>
        <h1>Whoopsie! 403 - Forbidden</h1>
        <Link to="/">
            Go Home
        </Link>
    </div>
);

export const BadRequest = () => (
    <div>
        <h1>Whoopsie! 400 - Bad Request</h1>
        <Link to="/">
            Go Home
        </Link>
    </div>
);
