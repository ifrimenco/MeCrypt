import React from 'react';
import { useHistory } from 'react-router';

import { usersService, authenticationService } from '../../services';
import { messagingService } from '../../services/messagingService';
import { UsersDropdown } from '../misc/UsersDropdown';

export const CreateRoom = (props) => {

    const history = useHistory();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState();
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const currentUserId = React.useRef(authenticationService.currentUserValue.id)

    React.useEffect(() => {
        const fetchData = async () => {
            //if (currentUserId == "") {redirect}
            const usersFromServer = await usersService.getUsers()
            let user = usersFromServer.find(user => {
                return user.id === currentUserId.current;
            });

            setCurrentUser(user);
            
            const index = usersFromServer.indexOf(user);
            if (index > -1) {
                usersFromServer.splice(index, 1);
            }

            await setUsers(usersFromServer);
        }

        fetchData();
    }, []);
    const addUser = (user) => {
        var newSelectedUsers = [...selectedUsers];
        newSelectedUsers.push(user);
        setSelectedUsers(newSelectedUsers);
        console.log(selectedUsers);
    }

    const onSubmit = async () => {

        let userIds = selectedUsers.map(user => user.id);
        userIds.push(currentUserId.current);

        await messagingService.createRoom(name, userIds)
            .then(response => {
                history.push('/');
            })
        debugger;
    }

    return (
        <div>
            <h2>Create Room</h2>
            <div class="container">
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Room Name</label>
                        <input name="email" value={name} onChange={(event) => { setName(event.target.value) }} type="text" className={'form-control'} />
                    </div>
                    <div className="form-group">
                        <UsersDropdown
                            users={users}
                            addUser={addUser}
                            setUsers={setUsers}
                        />
                        <h2>Selected Users:</h2>
                        {selectedUsers.map((user, index) => 
                            <p>{`${user.firstName} ${user.lastName}`}</p>)}
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={onSubmit} className="btn btn-primary" disabled={isSubmitting}>Login</button>
                        {isSubmitting &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}
