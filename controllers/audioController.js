const audioModel = require("../model/audioModel")
const { middlewareController } = require("../controllers/middlewareController");
const { imageModel } = require("../model/imageModel")
const videoModel = require("../model/videoModel")
const helperFunc = require("./helperFunction")
const { uploadFile } = require("./uploadFileController")
const ffprobestatic = require('ffprobe-static')
const thumbsupply = require('thumbsupply');
const fs = require('fs');
const uuid = require('uuid').v4;
var ffmpeg = require('ffmpeg');
//var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffprobePath = require('@ffprobe-installer/ffprobe').path;
var ffmpeg = require('fluent-ffmpeg');
const { checkVideoFormat, checkAudioFormat } = require("./helperFunction");






const audioController = {
    convertAudio : async(req,res) => { 
        try {

            //console.log("%%%%" + req.body)

            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }

                if(!helperFunc.checkMimeTypeAudio(req.file)){
                    return res.status(403).json({
                        "message" : "file input was not a audio file"
                    })
                }

                console.log(req.file)
                let convertType = req.body.convertType

                if(!checkAudioFormat(req)){
                    console.log("convert type wrong")

                    if(req.file.mimetype != "audio/mpeg"){
                        convertType = "mp3"
                        console.log("set convert type to mp3")
                    }else{
                       return res.status(401).json({
                            "message" : "convert type is not valid"
                        })
                    }

                }

                const audioPath = `public/audio/audio-${uuid()}.${convertType}`

                ffmpeg(req.file.path)
                    .output(audioPath)
                    .on('end', function (err) {
                        if (!err) {
                             return res.status(200).json({
                                "VIDEO_URL" : req.file.path,
                                "VIDEO_CONVERT_URL" : audioPath
                             })
                        }
                    })
                    .on('error', function (err) {
                        console.log('error: ', err)
                    }).run() 

            })


        } catch (err) {
            res.status(400).json(err.message);
        }
    }

}

module.exports = audioController;