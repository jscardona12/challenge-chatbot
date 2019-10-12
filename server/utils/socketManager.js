const socketIO = require('socket.io');
let User = require('../schemas/users');
let Message = require('../schemas/messages');
let moment = require('moment');


module.exports = (server) => {
    let io = socketIO(server);
    io.on('connection', (socket) => {

        socket.on('leave', (params) => {
            socket.leave(params.room);
        });

        socket.on('join', (params, callback) => {
            console.log('Params', params);
            socket.join(params.room);
            User.findById(params.userId, (err, user) => {
                if (err) {
                    callback(err)
                } else if (user) {
                    user.room = params.room;
                    user.socketId = socket.id;
                    new User(user).save();
                    User.find({'room': params.room}, (err, users) => {
                        if (err) {
                            callback(err)
                        } else {
                            io.to(params.room).emit('updateUserList', users);
                            socket.emit('newMessage', {
                                name: 'Admin',
                                room: params.room,
                                text: 'Welcome to the chat app.',
                                timestamp: moment.valueOf()
                            });
                            socket.broadcast.to(params.room).emit('newMessage', {
                                name: 'Admin',
                                room: params.room,
                                text: `${user.name} has joined.`,
                                timestamp: moment.valueOf()
                            })
                        }
                    })
                } else {
                    callback("User doesn't exists");

                }
            });


            callback();
        });


    })
    ;

};