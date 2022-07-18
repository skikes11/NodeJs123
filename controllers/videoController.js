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
const { checkVideoFormat } = require("./helperFunction");
const { uploadFileFields } = require("./uploadFileFields")



function videoCopyWitoutAudio(input, output, callback) {
    ffmpeg(input)
        .output(output)
        .noAudio().videoCodec('copy')
        .on('end', function () {
            console.log('conversion ended');
            callback(null);
        }).on('error', function (err) {
            console.log('error: ', err);
            callback(err);
        }).run();
}


function mergeMedia(aud, vid, output, callback) {
    ffmpeg()
        .input(aud)
        .input(vid)
        .output(output)
        .outputOptions(
          '-strict', '-2',
          '-map', '0:0',
          '-map', '1:0'
        ).on('end', function() {                    
            console.log('conversion ended');
            callback(null);
        }).on('error', function(err){
            console.log('error: ', err);
            callback(err);
        }).run();
}


const videoController = {
    UploadAndGet_ThumbnailOfvideo: async (req, res) => {
        try {

            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }
                console.log(req.file)
                const thumbnail_name = `thumbnail-${uuid()}.jpg`
                thumbsupply.generateThumbnail(req.file.path, {
                    size: thumbsupply.ThumbSize.LARGE, // or ThumbSize.LARGE
                    timestamp: 1, // TIME TO GET THUMBNAIL ON VIDEO
                    forceCreate: true,
                    cacheDir: "public/thumbnail",
                    mimetype: "video/mp4",
                    __filename: thumbnail_name

                })
                    .then((thumb) => {
                        console.log("##thumbnail " + thumb)

                        res.status(200).json({
                            "message": "success",
                            "thumbnail_Path": thumb,
                            "video_URL": req.file.path
                        })

                    })
            })


        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    convertVideoToGif: async (req, res) => {
        try {

            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }
                console.log(req.file)
                const gifPath = `public/gif/gif-${uuid()}.gif`

                ffmpeg(req.file.path)
                    .setStartTime('00:00:01')
                    .setDuration('5')
                    .size("1280x720")
                    .fps(40)
                    .output(gifPath)
                    .on('end', function (err) {
                        if (!err) {
                            return res.status(200).json({
                                "VIDEO_URL": req.file.path,
                                "GIF_PATH": gifPath
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

    },
    convertVideo: async (req, res) => {
        try {

            //console.log("%%%%" + req.body)

            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }

                console.log(req.file)


                if (!helperFunc.checkMimeTypeVideo(req.file)) {
                    return res.status(403).json({
                        "message": "file input was not a video file"
                    })
                }

                let convertType = req.body.convertType
                if (!checkVideoFormat(req)) {
                    console.log("convert type wrong")

                    if (req.file.mimetype != "video/mp4") {
                        convertType = "mp4"
                        console.log("set convert type to mp4")
                    } else {
                        return res.status(401).json({
                            "message": "convert type is not valid"
                        })
                    }

                }

                const videoPath = `public/video/video-${uuid()}.${convertType}`

                ffmpeg(req.file.path)
                    .output(videoPath)
                    .on('end', function (err) {
                        if (!err) {
                            return res.status(200).json({
                                "VIDEO_URL": req.file.path,
                                "VIDEO_CONVERT_URL": videoPath
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
    },
    extractVideo: async (req, res) => {
        try {



            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }

                console.log(req.file)


                if (!helperFunc.checkMimeTypeVideo(req.file)) {
                    return res.status(403).json({
                        "message": "file input was not a video file"
                    })
                }


                const videoPath = `public/video/video-${uuid()}.mp4`
                const audioPath = `public/audio/audio-${uuid()}.mp3`

                ffmpeg(req.file.path)
                    .output(videoPath)
                    .noAudio()
                    .on('end', function (err) {
                        if (!err) {
                            console.log("extract video to video no sound success")

                        }
                    })
                    .on('error', function (err) {
                        console.log('error: ', err)
                    }).run()


                videoCopyWitoutAudio(req.file.path, audioPath, (err) => {
                    if (!err) {
                        console.log('conversion complete');
                        //...

                    }
                })




            })


        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    mergeVideoandAudio: async (req, res) => {
        try {


            uploadFileFields(req,res,async(err)=>{
                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }

                const videoMerged = `public/video/video-${uuid()}.mp4`


                mergeMedia(req.files.fileAudio[0].path,req.files.fileVideo[0].path,videoMerged,(err)=>{
                    if(err){
                        return res.status(400).json({
                            "message" : "merge video get error"
                        })
                    }else{
                        return res.status(200).json({
                            "AUDIO_URL" : req.files.fileAudio[0].path,
                            "VIDEO_URL" : req.files.fileVideo[0].path,
                            "VIDEO_MERGE_URL" : videoMerged
                        })
                    }
                })

            
            })
            
        } catch (err) {
            res.status(400).json(err.message);
        }
    },

}

module.exports = videoController;