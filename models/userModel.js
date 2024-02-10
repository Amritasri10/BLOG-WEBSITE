const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'Username is required'],
    },
    email: {
        type: String,
        required: [true,'Email is required'],
    },
    password: {
        type: String,
        required: [true,'Password is required']
    },
    blogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }]
},{
    timestamps: true
});
const userModel = mongoose.model("User",userSchema);
module.exports = userModel;