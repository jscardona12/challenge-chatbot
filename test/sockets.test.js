const io = require('socket.io-client');
var mongoose = require('mongoose');
let User = require('../server/schemas/users');

describe('Connecting successfully and disconnecting', function () {

    let userId1, userId2;
    let socket_1, socket_2;

    beforeEach((done) => {
                socket_1 = io('http://localhost:3030');
                socket_2 = io('http://localhost:3030');
                done();

    });

    it('clients join correctly to a room',(done)=>{
        socket_1.emit('join',{room:'test',userId:'tesettestest',test:true},()=>{

        })
        socket_1.on('updateMessages',(messages)=>{
            if(messages)
                done();
        })

    });
    it('clients join correctly to a room',(done)=>{
        socket_2.emit('join',{room:'test',userId:'tesettestest',test:true},()=>{

        })
        socket_2.on('updateMessages',(messages)=>{
            if(messages)
                done();
        })

    });


    afterEach((done) => {
        socket_1 && socket_1.connected && socket_1.disconnect();
        socket_2 && socket_2.connected && socket_2.disconnect();
        done();
    });

});


