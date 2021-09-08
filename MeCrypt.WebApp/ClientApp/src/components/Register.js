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
    const [isFirstNameInvalid, setIsFirstNameInvalid] = React.useState(false);
    const [isLastNameInvalid, setIsLastNameInvalid] = React.useState(false);
    const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = React.useState(false);
    const [isEmailInvalid, setIsEmailInvalid] = React.useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = React.useState(false);
    const [lastName, setLastName] = React.useState("");
    if (password.length < 8) {

    }
    const onSubmit = async (e) => {
        e.preventDefault();
        let invalidFirstName = !authenticationService.isName(firstName);
        let invalidLastName = !authenticationService.isName(lastName);
        let invalidEmail = !authenticationService.isEmail(email);
        if (invalidFirstName) {
            setIsFirstNameInvalid(true);
        }
        else {
            setIsFirstNameInvalid(false);
        }
        if (invalidLastName) {
            setIsLastNameInvalid(true);
        }
        else {
            setIsLastNameInvalid(false);
        }
        if (invalidEmail) {
            setIsEmailInvalid(true);
            setIsEmailAlreadyUsed(false);
        }
        else {
            setIsEmailInvalid(false);
        }
        if (invalidFirstName || invalidEmail || invalidLastName) {
            return;
        }

        setIsSubmitting(true);
        await authenticationService.register(email, password, firstName, lastName)
            .then(
                user => {
                    window.location.reload();
                },
                error => {
                    if (error === 'E-mail Already Used!') {
                        setIsEmailAlreadyUsed(true);
                    }
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
                {isEmailInvalid && <h4 className="mecryptError">Invalid E-mail. Please try again with another one.</h4>}
                {isEmailAlreadyUsed && <h4 className="mecryptError">E-mail already used. Please try again with another one.</h4>}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(event) => { setPassword(event.target.value) }} name="password" type="password" className={'form-control'} />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input value={firstName} onChange={(event) => { setFirstName(event.target.value) }} name="firstName" type="firstName" className={'form-control'} />
                </div>
                {isFirstNameInvalid && <h4 className="mecryptError">Invalid First Name. Please try again with another one.</h4>}

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input value={lastName} onChange={(event) => { setLastName(event.target.value) }} name="lastName" type="lastName" className={'form-control'} />
                </div>
                {isLastNameInvalid && <h4 className="mecryptError">Invalid Last Name. Please try again with another one.</h4>}

                <div className="form-group">
                    <button onClick={(e) => onSubmit(e)} className="btn btn-primary" disabled={isSubmitting}>Register</button>
                    {isSubmitting &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                </div>
            </form>

        </div>
    )
}
