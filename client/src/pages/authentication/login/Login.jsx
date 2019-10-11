import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {login,saveUserIdInLS} from '../../../utils/serverPetitions.js';

export default (props)=>{
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    //History Hook
    let history = useHistory();

    let loginHandler = async (e)=>{
        e.preventDefault();
        try {
            const response = await login({username,password});
            if(response.error) {
                alert('Invalid login details')
            } else {
                saveUserIdInLS('userid', response.userId);
                history.push(`/chat`)
            }
        } catch (error) {
            alert('Invalid login details, verify your username and password')
        }

    }
    return (
        <Form className="auth-form">
            <Form.Group controlId="loginUsername">
                <Form.Control
                    type = "text"
                    name = "username"
                    placeholder = "Enter username"
                    onChange = {(e)=>{setUsername(e.target.value)}}
                />
            </Form.Group>

            <Form.Group controlId="loginPassword">
                <Form.Control
                    type = "password"
                    name = "password"
                    placeholder = "Password"
                    onChange = {(e)=>{setPassword(e.target.value)}}
                />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={loginHandler}>
                Login
            </Button>
        </Form>
    );
}