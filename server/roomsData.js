const roomsData = [];
const usersData = [];

module.exports = {
    //Function to get list of members in room using its id
    getRoomMembers: roomId => {
        let room = roomsData.find(roomValue => roomValue.roomId === roomId);
        return room !== undefined ? room.listOfMembers : null;
    },
    //Function to get information is video steam online or not
    roomIsStreamOn: roomId => {
        let room = roomsData.find(roomValue => roomValue.roomId === roomId);
        return room !== undefined ? room.isStreamOn : null;
    },
    //Function for getting information about user to send message
    getUserInfo: userId => {
        let username = usersData.find(userValue => userValue.userId === userId);

        return username !== undefined ? username : null;
    },
    //Function for adding new user
    addNewUser: (userId, userName, roomId) => {
        usersData.push({
            userId,
            username: userName,
            roomId
        });

        //Checking if there id room with current id in roomsData array
        let roomIndex = roomsData.findIndex(roomValue => roomValue.roomId === roomId);
        if (roomIndex !== -1) {
            roomsData[roomIndex].listOfMembers.push({userId, username: userName});
        } else {
            roomsData.push({
                roomId,
                isStreamOn: false,
                listOfMembers: [{userId, username: userName}]
            });
        }

        console.log("--------------------");
        console.log("RoomsData:", roomsData);
        console.log("UsersData", usersData);
    },
    //Function for removing user from lists if disconnect
    removeUser: (userId) => {
        try {
            let userIndex = usersData.findIndex(userValue => userValue.userId === userId);
            if (userIndex !== -1) {
                let roomId = usersData[userIndex].roomId;
                usersData.splice(userIndex, 1);

                let roomsIndex = roomsData.findIndex(roomValue => roomValue.roomId === roomId);
                let userIndexInRoom = roomsData[roomsIndex].listOfMembers.findIndex(userValue => userValue.userId === userId);
                roomsData[roomsIndex].listOfMembers.splice(userIndexInRoom, 1);

                if (roomsData[roomsIndex].listOfMembers.length === 0) {
                    roomsData.splice(roomsIndex, 1);
                }

                console.log("--------------------");
                console.log("RoomsData:", roomsData);
                console.log("UsersData", usersData);
            }
        } catch (e) {
            console.log(e);
        }
    }
};