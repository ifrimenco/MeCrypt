import React from 'react';

import { authenticationService } from '../services';

export const RegisterPage = (props) => {
    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
        props.history.push('/');
    }
    const [isSubmitting, setIsSubmitting] = React.useState(false); // creeaza un state
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");

    const onSubmit = () => {
        setIsSubmitting(true);

        authenticationService.register(email, password, firstName, lastName)
            .then(
                user => {
                    window.location.reload();
                },
                error => {
                    setIsSubmitting(false);
                }
            );
    }

    return (
        <div>
            <h2>Register</h2>

            <form>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input name="email" value={email} onChange={(event) => { setEmail(event.target.value) }} type="text" className={'form-control'} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(event) => { setPassword(event.target.value) }} name="password" type="password" className={'form-control'} />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input value={firstName} onChange={(event) => { setFirstName(event.target.value) }} name="firstName" type="firstName" className={'form-control'} />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input value={lastName} onChange={(event) => { setLastName(event.target.value) }} name="lastName" type="lastName" className={'form-control'} />
                </div>
                <div className="form-group">
                    <button onClick={onSubmit} className="btn btn-primary" disabled={isSubmitting}>Register</button>
                    {isSubmitting &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                </div>
            </form>

        </div>
    )
}
