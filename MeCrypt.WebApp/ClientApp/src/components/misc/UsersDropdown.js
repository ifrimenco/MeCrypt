import React from 'react';
import { useParams, useHistory } from 'react-router';
import { secretsService, usersService } from '../../services';

export const UsersDropdown = (props) => {
    const setUsers = props.setUsers;
    const addUser = props.addUser;
    const [filteredUsers, setFilteredUsers] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const [val, setVal] = React.useState(0);

    React.useEffect(() => {
        setFilteredUsers(props.users);
    }, []);

    const handleTextChange = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredUsers(props.users);
        }
        setFilteredUsers(props.users.filter(user =>
            (`${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`).includes(text.toLowerCase())
        ));
    }

    const handleUserClick = (e) => {
        var index = parseInt(e.target.getAttribute("data-key"));
        let userId = filteredUsers[index].id;
        var f = [...filteredUsers];
        f.splice(index, 1);
        setFilteredUsers(f)
        let users = props.users;
        let user;
        for (let i = 0; i < users.length; i += 1) {
            if (users[i].id === userId) {
                user = users[i];
                users.splice(i, 1);
                break;
            }
        }
        setFilteredUsers([]);
        setSearchText('');
        setUsers(users);
        addUser(user);

    };
    return (
        <>
            <label>Search Users</label>

            <input name="user" autocomplete="off" type="text" value={searchText} onChange={(e) => { handleTextChange(e.target.value) }} className='form-control' />
            {
                filteredUsers.length > 0 &&
                <div style={{ border: "1px solid black" }}>
                    {
                        filteredUsers.map((user, i) => <div className="userDropdownItem" data-key={i} onClick={(e) => { handleUserClick(e) }}>{`${user.firstName} ${user.lastName}`}</div>)
                    }
                </div>
            }
        </>
    )
}
