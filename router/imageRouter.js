const imageRouter = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const mediaController = require("../controllers/mediaController")
const imageController = require("../controllers/imageController")
const { uploadController } = require ("../controllers/uploadFileController")



// RESIZE IMAGE

imageRouter.get("/resize", async (req, res) => {
    
   imageController.resizeImage(req,res);
   
 });


module.exports = imageRouter