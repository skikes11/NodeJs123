const multer = require('multer');
const uuid = require('uuid').v4;
const helperFunc = require("./helperFunction")
const audioModel = require("../model/audioModel")
const imageModel = require("../model/imageModel")
const videoModel = require("../model/videoModel")
const path = require("path")

const storage = multer.diskStorage({

   
    destination: (req, file, cb) => {




        console.log(file)
        console.log(file.mimetype)



        if(helperFunc.getMediaType(file) == "audio"){
            cb(null, "public/audio")
        }else  if(helperFunc.getMediaType(file) == "video"){
            cb(null, "public/video")
        }else  if(helperFunc.getMediaType(file) == "image"){
            cb(null, "public/image")
        }else{
            cb(new Error("input file invalid"), null)
        }


    },
    filename: (req, file, cb) => {

        console.log(file)

        if(helperFunc.getMediaType(file) == "audio"){
            cb(null, `audio-${uuid()}.mp3`);

        }else  if(helperFunc.getMediaType(file) == "video" ){
            
            cb(null, `video-${uuid()}.mp4`);

        }else  if(helperFunc.getMediaType(file) == "image" ){
            cb(null, `image-${uuid()}.jpg`);
        }else{
            cb(new Error("input file invalid"), null)
        }

    }
})
const  uploadFile = multer({ storage }).single("file")


module.exports = {
    uploadFile
}