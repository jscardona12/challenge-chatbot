import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import DebounceInput from 'react-debounce-input';
import {registerUser, saveUserIdInLS, checkUsernameAvailability} from '../../../utils/serverPetitions.js';
//import './Registration.css';

export default (props) => {
    //State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(true);

    //History Hook
    let history = useHistory();


    let register = async (e) => {
        e.preventDefault();
        if (!usernameAvailable)
            return;
        try {
            const response = await registerUser({username, password});
            props.setLoadingState(false);
            if (response.error) {
                if (response.message) {
                    alert(response.message);
                } else {
                    alert('There was a problem register the user, please try again later')
                }

            } else {

                saveUserIdInLS('userid', response.userId);
                history.push(`/chat`);
            }
        } catch (error) {
            props.setLoadingState(false);
            alert('There was a problem register the user, please try again later')
        }
    };

    return (
        <>

            {
                !usernameAvailable ? <Alert className={{
                    'username-availability-warning': true,
                }} variant="danger">
                    <strong>{username}</strong> is already taken, try another username.
                </Alert> : null
            }

            <Form className="auth-form">
                <Form.Group controlId="formUsername">
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={register}>
                    Registration
                </Button>
            </Form>
        </>

    );
}
