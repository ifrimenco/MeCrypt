import React from 'react';
import { useParams, useHistory } from 'react-router';
import { secretsService } from '../../services';

import SecretShareComponent from './SecretShareComponent'

export const OpenSecret = (props) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [secretDetails, setSecretDetails] = React.useState({ title: '' })
    const [secret, setSecret] = React.useState()
    const [error, setError] = React.useState(false);
    const [incorrectData, setIncorrectData] = React.useState(false);
    const { secretId } = useParams();
    const [shares, setShares] = React.useState([0]);
    const [index, setIndex] = React.useState(1);

    React.useEffect(() => {
        async function fetchData() {
            const secretFromServer = await secretsService.getSecretDetails(secretId)
            setSecretDetails(secretFromServer);
        }

        fetchData();
    }, []);

    const addShare = () => {
        let s = shares;
        s.push(0);
        setShares(s);
        setIndex(index + 1);
        console.log(shares);
    }


    const deleteShare = (i) => {
        let s = shares;
        s.splice(i, 1);
        setIndex(index - 1);
        setShares(s);
        console.log(shares);
    }

    const openSecret = async (secretId, shares) => {
        debugger;
        var correctData = true;
        for (let i = 0; i < shares.length; i++) {
            if (shares[i] == '' || shares[i] == 0 || shares[i] == null) {
                correctData = false;
                break;
            }
        }
        if (correctData) {
            setIncorrectData(false);
            var returnedSecret = await secretsService.openSecret(secretId, shares)
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

    return (
        <>
            <h1>{secretDetails.title}</h1>
            <div className="container">
                <form>
                    <div className="form-group">
                        {shares.map((share, i) =>
                            <div class="row">
                                <label className="mr-3">Share {i}:</label>
                                <SecretShareComponent
                                    index={i}
                                    shares={shares}
                                    val={shares[i]}
                                    key={shares[i]}
                                    setShares={setShares} />
                                <button type="button" onClick={() => { deleteShare(i); }} className="deleteButton ml-3"></button>
                            </div>)}
                        <button type="button" className="btn btn-secondary" onClick={() => { addShare(); }}>Add Share</button>
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={() => { openSecret(secretId, shares) }} className="btn btn-primary" disabled={isSubmitting}>Open Secret</button>
                        {isSubmitting &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </div>
                </form>
                <div className="secretResult">
                    {incorrectData
                        ? <h4 style={{ color: 'red' }}>Please make sure the data is correct!</h4>
                        : <>
                            {error
                                ? <h4 style={{ color: 'red' }}>The secret could not be opened. Please make sure you submitted the right amount of shares!</h4>
                                : <> {(secret != null)
                                    ? <>
                                        <h4 style={{ color: 'green' }}>Your secret is: </h4>
                                        <textarea rows="10" cols="100" value={ secret }></textarea>
                                    </>
                                    : ""
                                }
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    )
}
