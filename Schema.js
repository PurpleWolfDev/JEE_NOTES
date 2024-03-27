const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    uId:{
        type:String,
        default:new Date().getTime()
    },
    subject:String,
    note:String,
    QType:String,
    group:String,
    img:Array,
    voiceNote:String,
    date:String,
    time:String
});

module.exports = {postSchema};