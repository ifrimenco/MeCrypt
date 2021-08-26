import React from 'react';
import { useParams, useHistory } from 'react-router';
import { adminService } from '../services';

export const EditUser = (props) => {

    const [loading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [user, setUser] = React.useState({ email: '', firstName: '', lastName: '', isAdmin: false, isDealer: false, isSecretViewer: false });
    const { userId } = useParams();
    const history = useHistory();

    React.useEffect(() => {
        async function fetchData() {
            try {
                let user = await adminService.getUser(userId);
              
                setUser(user);
                setIsLoading(false);
            }
            catch (e) {
                var x = JSON.stringify(e);
                console.log(e.message);
            }
        }
            fetchData();
    }, []);

    const handleAdminChange = () => {
        setUser({ ...user, isAdmin: !user.isAdmin });
    }

    const handleDealerChange = () => {
        setUser({ ...user, isDealer: !user.isDealer });
    }

    const handleSecretViewerChange = () => {
        setUser({ ...user, isSecretViewer: !user.isSecretViewer });
    }

    const saveChanges = () => {
        setIsSubmitting(true);

        adminService.editUser(user).then(response => {
            history.push('/adminPage');
        })
    }

    return (
        loading
            ? <p><em>Loading...</em></p>
            : <div className="container">
                <h2>{`${user.firstName} ${user.lastName}`}</h2>
                <p>E-mail: {user.email}</p>
                <div className="btn-group form-group">
                    <button type="button" onClick={handleAdminChange} className={"btn " + (user.isAdmin ? "btn-success" : "btn-outline-success")}>Admin</button>
                    <button type="button" onClick={handleDealerChange} className={"btn " + (user.isDealer ? "btn-success" : "btn-outline-success")}>Secret Dealer</button>
                    <button type="button" onClick={handleSecretViewerChange} className={"btn " + (user.isSecretViewer ? "btn-success" : "btn-outline-success")}>Secret Viewer</button>
                </div>
                <form>
                    <input type="hidden" id="isDealer" name="isDealer" value={user.isDealer} />
                    <input type="hidden" id="isAdmin" name="isAdmin" value={user.isAdmin} />
                    <input type="hidden" id="isSecretViewer" name="isSecretViewer" value={user.isSecretViewer} />
                    <button type="button" onClick={saveChanges} className="btn btn-primary">Save Changes</button>
                </form>
            </div>
    )
}
