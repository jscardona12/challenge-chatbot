import React, {Component,useState} from 'react';
import {useHistory} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import DebounceInput from 'react-debounce-input';
import {registerUser,saveUserIdInLS} from '../../../utils/serverPetitions.js';
//import './Registration.css';

export default (props) => {
    //State
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    //History Hook
    let history = useHistory();


    let register = async (e)=>{
        e.preventDefault();
        try {
            const response = await registerUser({username,password});
            props.setLoadingState(false);
            if (response.error) {
                alert('There was a problem register the user, please try again later')
            } else {
                saveUserIdInLS('userid', response.userId);
                history.push(`/chat`);
            }
        } catch (error) {
            props.loadingState(false);
            alert('There was a problem register the user, please try again later')
        }
    }

    return (
        <Form className="auth-form">
            <Form.Group controlId="formUsername">
                <DebounceInput
                    className="form-control"
                    placeholder="Username"
                    minLength={2}
                    debounceTimeout={300}
                    onChange={(e)=>{setUsername(e.target.value)}}
                />
            </Form.Group>

            <Form.Group controlId="formPassword">
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e)=>{setPassword(e.target.value)}}
                />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={register}>
                Registration
            </Button>
        </Form>
    );
}
