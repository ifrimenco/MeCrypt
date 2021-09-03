import React from 'react';
import { useParams, useHistory } from 'react-router';
import { adminService } from '../services';

export const HomeCard = (props) => {



    return (
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{props.title}</h5>
                <p class="card-text">{`${props.text}`}</p>
                <Link to={`${props.path}`}><a href="#" class="btn btn-primary">{props.buttonTitle}</a></Link>
            </div>
        </div>
    )
}
