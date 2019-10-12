import React from "react";

export default (props)=>{
    return (
        <div className="messages">
            <div id="list">
                <ul>
                    {props.messages.filter(message => message.room === props.room).slice(Math.max(props.messages.length - 50, 0)).map((message, index) => (
                        <li key={index}>

                            <div>
                                <div className="msg">
                                    <h4>{message.from}</h4>
                                    <div className="body">
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                                <span className="createdDate">{message.timestamp}</span>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}