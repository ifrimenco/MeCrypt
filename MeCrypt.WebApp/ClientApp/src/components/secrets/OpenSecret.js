import React from 'react';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { secretsService } from '../../services';

import SecretShareComponent from './SecretShareComponent'

export const OpenSecret = (props) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [secretDetails, setSecretDetails] = React.useState({ title: '' })
    const [secret, setSecret] = React.useState("")
    const [error, setError] = React.useState(false);
    const [incorrectData, setIncorrectData] = React.useState(false);
    const { secretId } = useParams();
    const [shares, setShares] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const secretFromServer = await secretsService.getSecretDetails(secretId)
            setSecretDetails(secretFromServer);
        }

        fetchData();
    }, []);

    const addShare = () => {
        let s = [...shares];
        s.push(0);
        setShares(s);
        console.log(s);
    }

    const deleteShare = (share, i) => {
        let s = [...shares];
        s.splice(i, 1);
        setShares(s);
        console.log(s);
    }

    const openSecret = async (secretId, shares) => {
        var correctData = true;
        for (let i = 0; i < shares.length; i++) {
            if (shares[i] == '' || shares[i] == 0 || shares[i] == null) {
                correctData = false;
                break;
            }
        }
        if (correctData) {
            setIncorrectData(false);
            var returnedSecret = await secretsService.openSecret(secretId, shares);
            setIsSubmitting(true);
            if (returnedSecret == "") {
                setError(true);
            }
            else {
                setSecret(returnedSecret);
                setError(false);
            }
        }
        else {
            setIncorrectData(true);
        }
        setIsSubmitting(false);
    }

    const handleShareChange = (share, index) => {
        var newShares = [...shares];

        newShares[index] = share;
        setShares(newShares);
    }
    return (
        <>
            <h1>{secretDetails.title}</h1>
            <div className="container">
                {secret === ''
                    ?
                    <form>
                        <div className="form-group">
                            <table className='table table-bordered table-striped' >
                                <thead>
                                    <tr>
                                        <th className="col">Share</th>
                                        <th className="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shares.map((share, index) =>
                                        <tr key={index}>
                                            <td className="col">
                                                <input name="share" value={share} type="number" key={index} onChange={(e) => { handleShareChange(e.target.value, index) }} className='form-control' />
                                            </td>
                                            <td className="col">
                                                <button type="button" onClick={() => { deleteShare(share, index) }} className="deleteButton"></button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-secondary" onClick={() => { addShare(); }}>Add Share</button>
                        </div>
                        <div className="form-group">
                            <button type="button" onClick={() => { openSecret(secretId, shares) }} className="btn btn-primary" disabled={isSubmitting}>Open Secret</button>
                            {isSubmitting &&
                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                        </div>
                        {incorrectData && <h4 style={{ color: 'red' }}>Please make sure the data is correct!</h4>}
                        {error && <h4 className="mecryptError">The secret could not be opened. Please make sure you submitted the right amount of shares!</h4>}
                    </form>
                    :
                    <div className="secretResult">


                        <> {(secret != null)
                            ? <>
                                <h4 className="mecryptOk">Your secret is: </h4>
                                <textarea rows="10" cols="100" value={secret}></textarea>
                                <Link to={`/secretsPage`}><button className="btn secretOpenedButton btn-primary"><h4>Go Back To Secrets Page</h4></button></Link>
                            </>
                            : ""
                        }
                        </>




                    </div>
                }
            </div>
        </>
    )
}
