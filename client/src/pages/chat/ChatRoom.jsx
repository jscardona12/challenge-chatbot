import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import io from 'socket.io-client';
import ActiveUsers from '../../components/ActiveUsers.jsx';
import Messages from '../../components/Messages.jsx';
import moment from 'moment';
import './_chat.scss';
var socket;
const initialState = {
    users: [],
    messages: [],
    newMsg: '',
    fetchingLocation: false
}

class ChatRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
    }

    componentWillUnmount(){
        const param = {
            room: this.props.match.params.room
        }
        socket.emit('leave', param);
        this.setState({...initialState});
    }

    componentDidMount() {
        const self = this;
        const params = {
            userId: this.props.match.params.userId,
            room: this.props.match.params.room
        }

        socket = io('http://localhost:3030')

        socket.emit('join', params,  (err) =>{
            if (err) {
                this.props.history.push('/');
            }
        });

        socket.on('updateUserList',(users) => {
            console.log(users);
            self.setState({users:users});
        });

        socket.on('updateMessages',(messages)=>{
            messages.forEach((msg)=>{
                msg.timestamp = moment(msg.timestamp).format('HH:mm');
            })
            self.setState({messages});
            if (messages.length > 3) {
                self.scrollToBottom();
            }
        });

        socket.on('newMessage', (message) => {
            var formattedTime = moment(message.timestamp).format('HH:mm');
            let newMsg = {
                text: message.text,
                from: message.from,
                room: message.room,
                timestamp: formattedTime
            }
            let results = self.state.messages;
            results.push(newMsg);
            self.setState({
                messages: results
            });

            var msgArr = self.state.messages.filter(message => message.room === this.props.match.params.room);
            if (msgArr.length > 3) {
                self.scrollToBottom();
            }
        });


        socket.on('disconnect',  () =>{
            console.log('Connection lost from server.');
        });

    }

    scrollToBottom() {
        // selectors
        var listHeight = document.querySelector('.messages #list ul');
        var messagesList = document.querySelector('.messages #list');
        var newMessage = document.querySelector('.messages #list ul li:last-child');
        // heights
        var messagesWrapperHeight = listHeight.clientHeight;
        var clientHeight = messagesList.clientHeight;
        var scrollTop = messagesList.scrollTop;
        var scrollHeight = messagesList.scrollHeight;
        var newMessageHeight = newMessage.offsetHeight;
        var lastMessageHeight = newMessage.previousSibling.offsetHeight;

        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            document.querySelector('#list').scrollTo(0, messagesWrapperHeight)
        }

    }

    clearForm() {
        this.setState({
            newMsg: ''
        });
    }

    inputUpdate(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    newMessage(e) {
        e.preventDefault()
        var obj = {
            'text': this.state.newMsg
        };
        socket.emit('createMessage', obj, function (data) {
            console.log(data);
            if(data && data.botError){
                alert(JSON.stringify(data.error));
            }
        });
        this.clearForm();
    }

    render() {
        const { newMsg } = this.state;

        return (
            <div className="chatPage">
                <ActiveUsers users={this.state.users} />

                <div className="messages_wrap">

                    <h1>
                        <Link to="/">
                            <i className="fas fa-chevron-circle-left"></i>
                        </Link>
                        {this.props.match.params.room}
                    </h1>

                    <Messages messages={this.state.messages} room={this.props.match.params.room} />

                    <div className="newMsgForm">
                        <div className="wrap">
                            <form onSubmit={(e) => this.newMessage(e)}>

                                <div className="form_wrap">
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input">
                                                <input name="newMsg" placeholder="Type your message..." autoComplete="off" value={newMsg} onChange={this.inputUpdate.bind(this)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btnWrap">
                                    <button type="submit" className="btn">
                                        <i className="fab fa-telegram-plane"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(ChatRoom);