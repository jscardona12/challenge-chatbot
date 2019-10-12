const socketIO = require('socket.io');
let User = require('../schemas/users');
let Message = require('../schemas/messages');
let moment = require('moment');
let request = require('request');


module.exports = (server) => {
    let io = socketIO(server);
    io.on('connection', (socket) => {

        socket.on('leave', (params) => {
            socket.leave(params.room);
        });

        socket.on('join', (params, callback) => {
            socket.join(params.room);
            User.findById(params.userId, (err, user) => {
                if (err) {
                    callback(err)
                } else if (user) {
                    user.room = params.room;
                    user.socketId = socket.id;
                    new User(user).save((err,user)=>{
                        if(err)
                            callback(err);
                        else{
                            User.find({'room': params.room}, (err, users) => {
                                if (err) {
                                    callback(err)
                                } else {
                                    io.to(params.room).emit('updateUserList', users);
                                    Message.find({'room':params.room}).sort({'timestamp': -1}).limit(50).exec((err,messages)=>{
                                        if(err){
                                            callback(err);
                                        }
                                        else
                                            io.to(params.room).emit('updateMessages', messages.reverse());
                                    });
                                    socket.emit('newMessage', {
                                        from: 'Admin',
                                        room: params.room,
                                        text: 'Welcome to the chat app.',
                                        timestamp: moment.valueOf()
                                    });
                                    socket.broadcast.to(params.room).emit('newMessage', {
                                        from: 'Admin',
                                        room: params.room,
                                        text: `${user.username} has joined.`,
                                        timestamp: moment.valueOf()
                                    })
                                }
                            })
                        }

                    });

                } else {
                    callback("User doesn't exists");

                }
            });


            callback();
        });

        socket.on('createMessage', (message, callback) => {
            if(!message.text)
                callback('error');
            else{
                const regex = /(\/stock)=([a-zA-Z.]+)/gm;
                let match = regex.exec(message.text);
                if(match[0] && match[2]){
                    request.get('https://stooq.com/q/l/?s='+match[2]+'&f=sd2t2ohlcv&h&e=csv',(err,res,data)=>{
                        let jsonData = csvJSON(data);
                        console.log(jsonData);
                        User.find({'socketId':socket.id},(err,users)=>{
                            let user;
                            if(users[0])
                                user = users[0];
                            if(err)
                                callback(err);
                            if (user) {
                                let tempObj = {
                                    from: 'StockBot',
                                    room: user.room,
                                    text: match[2].toUpperCase() + " quote is $"+ jsonData[0]['Close']+ " per share.",
                                    timestamp: moment().toDate()
                                };
                                new Message(tempObj).save((err,message)=>{
                                    if(!err){
                                        io.to(user.room).emit('newMessage', tempObj);
                                        callback({
                                            data: tempObj
                                        });
                                    }
                                });

                            }
                            callback();
                        })
                    })
                }
                else{
                    User.find({'socketId':socket.id},(err,users)=>{
                        let user;
                        if(users[0])
                            user = users[0];
                        if(err)
                            callback(err);
                        if (user && message) {
                            let tempObj = {
                                from: user.username,
                                room: user.room,
                                text: message.text,
                                timestamp: moment().toDate()
                            };
                            new Message(tempObj).save((err,message)=>{
                                if(!err){
                                    io.to(user.room).emit('newMessage', tempObj);
                                    callback({
                                        data: tempObj
                                    });
                                }
                            });

                        }
                        callback();
                    })
                }

            }
        });

        socket.on('disconnect', () => {
            User.find({'socketId':socket.id},(err,users)=>{
                let user;
                if(users[0])
                    user = users[0];
                if(err)
                    callback(err);

                if(user){
                    user.socketId = '';
                    user.room = '';
                    new User(user).save();
                }
            })


        });

    })
    ;

};

function csvJSON(csv){

    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }
    return result;
}