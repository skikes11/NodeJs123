const audioRouter = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const mediaController = require("../controllers/mediaController")
const audioController = require("../controllers/audioController")
const { uploadController } = require ("../controllers/uploadFileController")



// CONVERT AUDIO 

audioRouter.get("/convert", async (req, res) => {
    
    audioController.convertAudio(req,res)
   
 });


module.exports = audioRouter