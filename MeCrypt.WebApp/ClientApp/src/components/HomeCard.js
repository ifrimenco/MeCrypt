import React from 'react';
import { useParams, useHistory } from 'react-router';
import { adminService } from '../services';

export const HomeCard = (props) => {



    return (
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">{`${props.cardText}`}</p>
                <Link to={`${props.path}`}><a href="#" class="btn btn-primary">Go somewhere</a></Link>
            </div>
        </div>
    )
}
