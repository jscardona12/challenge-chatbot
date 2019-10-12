import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {getUserId} from '../../utils/serverPetitions.js';


class Chat extends Component {
    constructor(props){
        super(props);
        this.state = {
            room: 'Animals',
            username: '',
            userId:''
        };
    }

    async componentDidMount() {
        let result = await getUserId();
        if(result === null || result === undefined){
            this.props.history.push(`/`);
        }
        else{
            this.setState({userId:result});
        }
    }


    join(e) {
        e.preventDefault();
        const { userId, room } = this.state;

        console.log('b',this.state);
        if (userId && room) {
            console.log('a',userId,room);
            this.props.history.push(`/chat/${userId}/${room}`)
        }
    }

    render() {
        return (
            <div className="container">
                <Form className="auth-form">
                    <Form.Group controlId="roomSelector">
                        <Form.Control
                            as = "select"
                            onChange = {(e)=>{
                                this.setState({room:e.target.value})
                            }}
                        >
                            <option>Animals</option>
                            <option>Games</option>
                            <option>Nature</option>
                            <option>Food</option>
                            <option>Tech</option>

                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={(e)=>{this.join(e)}}>
                        Join
                    </Button>
                </Form>
            </div>

        )
    }
}

export default withRouter(Chat);
