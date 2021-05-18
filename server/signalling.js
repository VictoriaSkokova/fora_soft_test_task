const socket_io = require('socket.io');
const roomsData = require('./roomsData');

module.exports = function (server) {
    const io = socket_io(server, {
        cors: {
            origin: "*"
        },
        transports: ['websocket'],
        secure: true
    });

    io.on('connect', socket => {
        socket.on('join', async (data) => {
            const {room, username, time} = data;

            if (username !== 'Server' || username === undefined || username === null) {
                roomsData.addNewUser(socket.id, username, room);
                let listUsersOnline = roomsData.getRoomMembers(room);
                let isStreamOnline = roomsData.roomIsStreamOn(room);
                socket.emit('logged', {
                    roomId: room,
                    username: username,
                    userId: socket.id,
                    listOnline: listUsersOnline,
                    isStreamOnline
                });

                socket.join(room);
                sendMessage(room, username, time, `${username} just join chat room!`, socket.id);
                updateList(listUsersOnline, room);
            } else {
                socket.emit('error', {errorType: 'loggedError'});
            }

        });

        socket.on('disconnect', () => {
            let user = roomsData.getUserInfo(socket.id);
            let date = new Date();

            if (user !== null) {
                roomsData.removeUser(user.userId);

                let listUsersOnline = roomsData.getRoomMembers(user?.roomId);
                updateList(listUsersOnline, user.roomId);
                sendMessage(user.roomId, user.username, `${date.getHours()}:${date.getMinutes()}`, `${user.username} just left chat room!`, socket.id);
            }
        });

        socket.on('message', (data) => {
            if (data.text !== null && data.text !== undefined && data.text !== "")
                sendMessage(data.room, data.username, data.time, data.text, data.userId);
            else {
                socket.emit('error', {errorType: 'messageError'});
            }
        })

        const sendMessage = (room, username, time, text, userSendingMessage) => {
            io.to(room).emit('send:message', {username, time, text, userSendingMessage});
        }

        const updateList = (listOfUsers, room) => {
            io.to(room).emit('change:list', listOfUsers);
        }
    });
}