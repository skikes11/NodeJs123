const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;


const  videoSchema= new mongoose.Schema({
        video_id: {
            type: String,
        },
        video_url: {
            type: String,
        },
});


let videoModel = mongoose.model("videoModel", videoSchema);
module.exports =  videoModel;