const rooms = new Map();
const users = new Map();
// rooms , room , {id:user}
// Join user to room
function userJoin(id, username, room) {
    if (!rooms.has(room)) {
        const newRoom = new Map();
        rooms.set(room, newRoom);
    }
    roomUsers = rooms.get(room);
    if (!roomUsers.has(id)) {
        roomUsers.set(id, username);
    }
    users.set(id, { username, room });
    return;
}

// Get room and username from id
function getCurrentUser(id) {
    return users.get(id);
}

// User leaves
function userLeave(id) {
    const room = users.get(id).room;
    rooms.get(room).delete(id);
    users.delete(id);
}

function getRoomUsers(room) {
    const users = [];
    for (const [key, value] of rooms.get(room).entries()) {
        users.push(value);
    }
    return users;
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
};
