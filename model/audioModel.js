const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;


const  audioSchema= new mongoose.Schema({
        audio_id: {
            type: String,
        },
        audio_url: {
            type: String,
        },
});


let audioModel = mongoose.model("audioModel", audioSchema);
module.exports =  audioModel;