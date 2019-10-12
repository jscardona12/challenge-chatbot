import React from 'react';

export default (props)=>{
    return (
        <div className="activeUsers">
            <h2 className="headline">
                Active users
            </h2>
            <div id="users">
                <ul>
                    {props.users.map((user, index) => (
                        <li key={index}>
                            <i className="fas fa-circle"></i>
                            <span>
                                    {user.username}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

