import React from 'react';
import { useParams, useHistory } from 'react-router';
import { secretsService, usersService, authenticationService } from '../../services';

import { permissionTypes } from '../../helpers';
import { UsersDropdown } from '../misc/UsersDropdown';

export const CreateSecret = (props) => {
    const history = useHistory();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [userShares, setUserShares] = React.useState([]);
    const [minimumShares, setMinimumShares] = React.useState(0);
    const [title, setTitle] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [content, setContent] = React.useState("");
    const [index, setIndex] = React.useState(1);

    React.useEffect(() => {
        if (!authenticationService.hasPermission(permissionTypes.Secrets_Deal)) {
            history.push('/unauthorized');
        }

        const fetchData = async () => {
            //if (currentUserId == "") {redirect}
            const usersFromServer = await usersService.getUsers()
            await setUsers(usersFromServer);
        }

        fetchData();
    }, []);

    const addUser = async (user) => {
        let newUserShares = [...userShares];
        newUserShares.push({ user: user, item1: user.id, item2: 1 });
        await setUserShares(newUserShares);
        console.log(userShares);
    };

    const submitSecret = async (content, title, minimumShares, userSecrets) => {
        setIsSubmitting(true);

        await secretsService.createSecret(content, title, minimumShares, userSecrets).then(response => {
            history.push('/secretsPage');
        })
    }

    const changeNrShares = (value, index) => {
        var newUserShares = userShares;
        newUserShares[index].item2 = parseInt(value);
        setUserShares(newUserShares);
        debugger;
    }

    const unselectUser = (userShare, index) => {
        var newUserShares = [...userShares];
        newUserShares.splice(index, 1);
        var newUsers = [...users];
        newUsers.push(userShare.user);

        setUserShares(newUserShares);
        setUsers(newUsers);
    }

    return (
        <div>
            <h1>Create Secret</h1>
            <br />
            <form>
                <div class="inputContainer">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input name="title" value={title} onChange={(event) => { setTitle(event.target.value) }} type="text" className={'form-control'} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea rows="5" cols="100" value={content} onChange={(event) => { setContent(event.target.value) }} name="content" className={'form-control'} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Minimum Number of Shares </label>
                        <input type="number" value={minimumShares} onChange={(event) => { setMinimumShares(event.target.value) }} name="password" className={'form-control'} />
                    </div>
                    <UsersDropdown
                        users={users}
                        addUser={addUser}
                        setUsers={setUsers}
                    />
                </div>
                <div class="createRoomSelectedUsers">
                    <table className='table createRoomTable table-striped' >
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>No. of Shares</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userShares.map((userShare, index) =>
                                <tr key={index}>
                                    <td>{userShare.user.firstName + " " + userShare.user.lastName}</td>
                                    <td><select onChange={(e) => {changeNrShares(e.target.value, index)} }class="btn btn-dropdown" name={"shares-" + index} id={"shares-" + index}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </select></td>
                                    <td><button type="button" onClick={() => { unselectUser(userShare, index) }} className="deleteButton"></button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="form-group submitCreateRoom">
                    <button type="button" onClick={() => { submitSecret(content, title, minimumShares, userShares) }} className="btn btn-lg btn-primary" disabled={isSubmitting}>Store Secret</button>
                    {isSubmitting &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                </div>
            </form>
        </div>
    )
}
