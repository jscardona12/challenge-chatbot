import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import DebounceInput from 'react-debounce-input';
import {registerUser,saveUserIdInLS, checkUsernameAvailability} from '../../../utils/serverPetitions.js';
//import './Registration.css';

export default (props) => {
    //State
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [usernameAvailable,setUsernameAvailable] = useState(true);

    //History Hook
    let history = useHistory();


    let register = async (e)=>{
        e.preventDefault();
        if(!usernameAvailable)
            return;
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
            props.setLoadingState(false);
            alert('There was a problem register the user, please try again later')
        }
    };

    let checkUsername= async (event)  => {
        if(event.target.value !== '' && event.target.value !== undefined) {
            setUsername(event.target.value);
            try {
                const response = await checkUsernameAvailability(username);
                props.setLoadingState(false);
                if(response.error) {
                    setUsernameAvailable(false);
                } else {
                    setUsernameAvailable(true);
                }
            } catch (error) {
                props.setLoadingState(false);
                setUsernameAvailable(false);
            }
        } else if (event.target.value === '') {
            setUsernameAvailable(true);
        }
    }

    return (
        <>

            {
               usernameAvailable? <Alert className={{
                    'username-availability-warning': true,
                }} variant="danger">
                    <strong>{username}</strong> is already taken, try another username.
                </Alert> :null
            }    

            <Form className="auth-form">
                <Form.Group controlId="formUsername">
                    <DebounceInput
                        className="form-control"
                        placeholder="Username"
                        minLength={2}
                        debounceTimeout={300}
                        onChange={(e)=>{checkUsername(e)}}
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
        </>

    );
}
