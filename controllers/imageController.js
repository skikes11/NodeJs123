const audioModel = require("../model/audioModel")
const { middlewareController } = require("../controllers/middlewareController");
const { imageModel } = require("../model/imageModel")
const videoModel = require("../model/videoModel")
const helperFunc = require("./helperFunction")
const { uploadFile } = require("./uploadFileController")
const ffprobestatic = require('ffprobe-static')
const thumbsupply = require('thumbsupply');
const sharp = require('sharp');
const fs = require('fs');
const uuid = require('uuid').v4;
var ffmpeg = require('ffmpeg');
//var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffprobePath = require('@ffprobe-installer/ffprobe').path;
var ffmpeg = require('fluent-ffmpeg');
const { checkVideoFormat, checkAudioFormat } = require("./helperFunction");






const imageController = {
    resizeImage: async (req, res) => {
        try {



            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }

                if (!helperFunc.checkMimeTypeImage) {
                    return res.status(403).json({
                        "message": "file input was not a image file"
                    })
                }

                console.log(req.file)


                const imageResizePath = `public/image/image-${uuid()}.jpg`

                sharp(req.file.path).resize({ height: parseInt( req.body.height), width: parseInt( req.body.width)}).toFile(imageResizePath)
                    .then(function (newFileInfo) {
                        console.log("Success");

                        return res.status(403).json({
                            "IMAGE_URL": req.file.path,
                            "RESIZE_IMAGE_PATH": imageResizePath
                        })

                    })
                    .catch(function (err) {
                        console.log("Error occured");
                    });

            })


        } catch (err) {
            res.status(400).json(err.message);
        }
    }

}

module.exports = imageController;