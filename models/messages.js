const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
    user: {
        type: String,
        reuired: true,
    },
    msg: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
});

const Msg = mongoose.model("msg", msgSchema);

module.exports = Msg;
