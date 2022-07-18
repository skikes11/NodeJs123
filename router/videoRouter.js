const videoRouter = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const mediaController = require("../controllers/mediaController")
const videoController = require("../controllers/videoController")
const { uploadController } = require ("../controllers/uploadFileController")




//UPLOAD MEDIA 
videoRouter.post("/", async (req, res) => {
    
    mediaController.UploadMedia(req,res);
    
});

//GET VIDEO THUMBNAIL
videoRouter.get("/", async (req, res) => {
    
    videoController.UploadAndGet_ThumbnailOfvideo(req,res);
  
});

// CONVERT VIDEO TO GIF

videoRouter.get("/gif", async (req, res) => {
    
   videoController.convertVideoToGif(req,res);
  
});

// CONVERT VIDEO 

videoRouter.get("/convert", async (req, res) => {
    
    videoController.convertVideo(req,res)
   
 });

 // EXTRACT VIDEO 

videoRouter.get("/extract", async (req, res) => {
    
    videoController.extractVideo(req,res)
   
 });

 // EXTRACT VIDEO 

 videoRouter.get("/merge", async (req, res) => {
    
    videoController.mergeVideoandAudio(req,res)
   
 });




module.exports = videoRouter