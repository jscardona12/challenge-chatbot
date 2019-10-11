import React, {useState} from 'react';
import {Tabs, Tab} from 'react-bootstrap'
import Login from './login/Login';
import Registration from './registration/Registration';
import "./Authentication.css"

export default () => {
    const [loadingState, setLoadingState] = useState(false);
    return (
        <div className="container">
            {/*<div className={`overlay auth-loading ${loadingState ? '' : 'visibility-hidden'}`}>
                <h1>Loading</h1>
            </div>*/}
            <div className="authentication-screen">
                <Tabs variant="pills" defaultActiveKey="login">
                    <Tab eventKey="login" title="Login">
                        <Login setLoadingState = {setLoadingState} />
                    </Tab>
                    <Tab eventKey="registration" title="Registration">
                        <Registration setLoadingState = {setLoadingState}/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}