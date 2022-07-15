const audioModel = require("../model/audioModel")
const { middlewareController } = require("../controllers/middlewareController");
const { imageModel } = require("../model/imageModel")
const videoModel = require("../model/videoModel")
const helperFunc = require("./helperFunction")
const { uploadFile } = require("./uploadFileController")
const ffprobestatic = require('ffprobe-static')

const mediaController = {
    UploadMedia: async (req, res) => {
        try {

            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }
                console.log(req.file)

                console.log(helperFunc.getMediaType(req.file))

                if (helperFunc.getMediaType(req.file) == "audio") {


                    const audio = new audioModel();
                    audio.audio_id = req.file.filename;
                    audio.audio_url = `/static/audio/${req.file.filename}`
                    audio.save();

                } else if (helperFunc.getMediaType(req.file) == "video") {

                    const video = new videoModel();
                    video.video_id = req.file.filename;
                    video.video_url = `/static/video/${req.file.filename}`
                    video.save();

                } else if (helperFunc.getMediaType(req.file) == "image") {

                    const image = new imageModel();
                    image.image_id = req.file.filename;
                    image.image_url = `/static/image/${req.file.filename}`
                    image.save();
                }
                console.log("upload image completed")

                res.status(200).json({
                    "message": "upload audio completed"
                })

            })


        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    getInfoMedia: async (req, res) => {
        try {


            uploadFile(req, res, async (err) => {
                console.log(req.file)
                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                } else if (req.file) {

                    
                    if (helperFunc.getMediaType(req.file) == "audio") {

                        const audio = new audioModel();
                        audio.audio_id = req.file.filename;
                        audio.audio_url = `/static/audio/${req.file.filename}`
                        audio.save();

                        helperFunc.getMediaInfor(req,res,req.file.path);

                    } else if (helperFunc.getMediaType(req.file) == "video") {

                        const video = new videoModel();
                        video.video_id = req.file.filename;
                        video.video_url = `/static/video/${req.file.filename}`
                        video.save();
                        helperFunc.getMediaInfor(req,res,req.file.path);

                    } else if (helperFunc.getMediaType(req.file) == "image") {

                        const image = new imageModel();
                        image.image_id = req.file.filename;
                        image.image_url = `/static/image/${req.file.filename}`
                        image.save();
                        helperFunc.getMediaInfor(req,res,req.file.path);
                    }
                    console.log("upload image completed")

                    

                }else{ 



                }


            })



        } catch (err) {
            res.status(400).json(err.message);
        }
    },



}

module.exports = mediaController;