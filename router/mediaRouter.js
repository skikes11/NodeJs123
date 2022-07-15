const mediaRouter = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const mediaController = require("../controllers/mediaController")
const { uploadController } = require ("../controllers/uploadFileController")




//UPLOAD MEDIA 
mediaRouter.post("/", async (req, res) => {
    
    mediaController.UploadMedia(req,res);
    
});

//GET MEDIA INFO
mediaRouter.get("/", async (req, res) => {
    
  mediaController.getInfoMedia(req,res)
  
});

module.exports = mediaRouter