import React from 'react';
import { useParams, useHistory } from 'react-router';
import { secretsService, usersService } from '../../services';

const UserSecretComponent = (props) => {
    const [users, setUsers] = React.useState([]);
    const setUserShares = props.setUserShares;
    React.useEffect(() => {
        async function fetchData() {
            const user = await usersService.getUsers()
            await setUsers(user);
            handleUserChange(user[0].id)
        }

        fetchData();
    }, []);

    const handleUserChange = (userId) => {
        var userShares = props.userShares;
        userShares[props.index].item1 = userId;
        setUserShares(userShares);
    }

    const handleShareNrChange = (shareNr) => {
        var userShares = props.userShares;
        userShares[props.index].item2 = shareNr;
        setUserShares(userShares);
    }

    return (
        <>
            <div className="form-group row">
                <select onChange={(e) => { handleUserChange(e.target.value)}}>
                    {users.map((user, i) => <option value={user.id} key={user.id}>{`${user.firstName} ${user.lastName}`}</option>)}
                </select>
                <input name="title" min="1" max="10" onChange={(e) => { handleShareNrChange(e.target.value) }} type="number" className={'form-control'} />
            </div>
        </>
    )
}

export const CreateSecret = (props) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false); // creeaza un state
    const [userShares, setUserShares] = React.useState([{ item1: "", item2: "", index: 0 }]);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [index, setIndex] = React.useState(1);
    const history = useHistory();

    React.useEffect(() => { });

    const addUser = () => {
        let us = userShares;
        us.push({ item1: "", item2: "", index: index });
        setUserShares(us);
        setIndex(index + 1);
    };

    const submitSecret = async (content, title, userSecrets) => {
        setIsSubmitting(true);

        await secretsService.createSecret(content, title, userSecrets).then(response => {
            history.push('/');
        })
    }

    return (
        <form>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input name="title" value={title} onChange={(event) => { setTitle(event.target.value) }} type="text" className={'form-control'} />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea rows="5" cols="100" value={content} onChange={(event) => { setContent(event.target.value) }} name="password" type="password" className={'form-control'} />
            </div>

            {userShares.map((userShare, index) =>
                <UserSecretComponent id={index}
                    index={index}
                    userShares={userShares}
                    setUserShares={setUserShares} />)}

            <button type="button" class="btn btn-secondary" onClick={() => { addUser(); }}>Add User</button>
            <div className="form-group">
                <button type="button" onClick={() => { submitSecret(content, title, userShares) }} className="btn btn-primary" disabled={isSubmitting}>Store Secret</button>
                {isSubmitting &&
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
            </div>
        </form>
    )
}
