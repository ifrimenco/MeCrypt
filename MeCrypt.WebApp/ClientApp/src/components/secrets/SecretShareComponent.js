import React from 'react';
import { useParams, useHistory } from 'react-router';
import { secretsService, usersService } from '../../services';

const SecretShareComponent = (props) => {
    const setShares = props.setShares;
    const [val, setVal] = React.useState(0);

    React.useEffect(() => {
        setVal(props.val);
    }, []);

    const handleShareChange = (share) => {
        setVal(share);
        var shares = props.shares;
        shares[props.index] = share;
        setShares(shares);
        console.log(shares);
    }

    return (
        <>
            <div className="form-group">
                <input name="share" type="number" value={val} onChange={(e) => { handleShareChange(e.target.value) }} className='form-control' />
            </div>
        </>
    )
}

export default SecretShareComponent;