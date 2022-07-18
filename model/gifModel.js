const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;


const  gifSchema= new mongoose.Schema({
        gif_id: {
            type: String,
        },
        gif_url: {
            type: String,
        },
});


let gifModel = mongoose.model("gifModel", gifSchema);
module.exports =  {gifModel};