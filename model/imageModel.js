const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;


const  imageSchema= new mongoose.Schema({
        image_id: {
            type: String,
        },
        image_url: {
            type: String,
        },
});


let imageModel = mongoose.model("imageModel", imageSchema);
module.exports =  {imageModel};