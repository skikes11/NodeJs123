const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;


const  thumbnailSchema= new mongoose.Schema({
        thumbnail_id: {
            type: String,
        },
        thumbnail_url: {
            type: String,
        },
});


let thumbnailModel = mongoose.model("thumbnailModel", thumbnailSchema);
module.exports =  {thumbnailModel};