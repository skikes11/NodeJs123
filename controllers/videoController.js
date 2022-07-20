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
var ffprobePath = require('@ffprobe-installer/ffprobe').path;
var ffmpeg_flu = require('fluent-ffmpeg');
const { checkVideoFormat } = require("./helperFunction");
const { uploadFileFields } = require("./uploadFileFields")
const ffmpegOnProgress = require('ffmpeg-on-progress')
const { exec } = require("child_process");



const logProgress = (progress, event) => {
    // progress is a floating point number from 0 to 1
    console.log('progress', (progress * 100).toFixed())
}
const durationEstimate = 38000



function mergeMedia(aud, vid, output, callback) {
    ffmpeg_flu()
        .input(aud)
        .input(vid)
        .output(output)
        .outputOptions(
            '-strict', '-2',
            '-map', '0:0',
            '-map', '1:0'
        ).on('end', function () {
            console.log('conversion ended');
            console.log('resize video successfully');
            callback(null);
        })
        .on('progress', function (progress) {
            console.log('... frames: ' + progress.frames);

        })
        .on('error', function (err) {
            console.log('error: ', err);
            callback(err);
        }).run();
}

function resizeVideo(res, input, output, displayResolution, callback) {

    let size = "426x240"

    if (displayResolution == "240") {
        size = "426x240"
    } else if (displayResolution == "360") {
        size = "640x360"
    } else if (displayResolution == "480") {
        size = "854x480"
    } else if (displayResolution == "720") {
        size = "1280x720"
    } else if (displayResolution == "1080") {
        size = "1920x1080"
    } else if (displayResolution == "2160") {
        size = "3860x2160"
    }


    ffmpeg_flu()
        .input(input)
        .output(output)
        .videoCodec('libx264')
        .format('mp4')
        .size(size)
        .on('end', function () {
            console.log('conversion ended');

            res.status(200).json({
                "VIDEO_URL": input,
                "VIDEO_RESIZE_URL": output
            })


        })
        .on('error', function (err) {
            console.log('An error occurred: ' + err.message);

        })
        .on('progress', function (progress) {
            console.log('... frames: ' + progress.frames);

        })
        .on('end', function () {
            console.log('Finished processing');

        })
        .run();
}


function convert(input, output, callback) {
    ffmpeg(input)
        .output(output)
        .format('mp3')
        .on('end', function () {
            console.log('conversion ended');
            callback(null);
        }).on('error', function (err) {
            console.log('error: ', err.message);
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

                ffmpeg_flu(req.file.path)
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

                ffmpeg_flu(req.file.path)
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


                if (!req.file) {
                    return res.status(403).json({
                        "message": "file input was not a video file"
                    })
                }


                const videoPath = `public/video/video-${uuid()}.mp4`
                const audioPath = `public/audio/audio-${uuid()}.mp3`




                ffmpeg_flu()
                .input(req.file.path)
                .output(audioPath)
                .videoCodec('libx264')
                .noAudio()
                .format('mp4')
                .on('end', function () {
                    console.log('conversion ended');
                })
                .on('error', function (err) {
                    console.log('An error occurred: ' + err.message);
        
                })
                .on('progress', function (progress) {
                    console.log('... frames: ' + progress.frames);
        
                })
                .on('end', function () {
                    console.log('Finished processing');
        
                })
                .run();
            
                    
                    
                var process = new ffmpeg(req.file.path);
                console.log(process)
                console.log("comming to extract try")
                process.then(function (video) {
                    // Callback mode
                    console.log(video.metadata);
                    console.log('The video is ready to be processed');
                    video.fnExtractSoundToMP3(audioPath, function (error, file) {
                        if (!error) {
                            console.log('Audio file: ' + file);
                        }else{
                            console.log(error.message)
                        }
                    });
                }, function (err) {
                    console.log('Error: ' + err);
                });
                

                // exec(`ffmpeg -i ${req.file.path}  ${audioPath}`, (err, output) => {
                //     // once the command has completed, the callback function is called
                //     if (err) {
                //         // log and return if we encounter an error
                //         console.error("could not execute command: ", err)
                //         return
                //     }
                //     // log the output received from the command
                //     console.log("Output: \n", output)
                // });







                return res.status(200).json({

                    "VIDEO_URL": req.file.path,
                    "AUDIO_EXTRACT_URL": audioPath,
                    "VIDEO_EXTRACT_URL": audioPath
                })


            })


        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    mergeVideoandAudio: async (req, res) => {
        try {


            uploadFileFields(req, res, async (err) => {
                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }

                const videoMerged = `public/video/video-${uuid()}.mp4`


                mergeMedia(req.files.fileAudio[0].path, req.files.fileVideo[0].path, videoMerged, (err) => {
                    if (err) {
                        return res.status(400).json({
                            "message": "merge video get error"
                        })
                    } else {
                        return res.status(200).json({
                            "AUDIO_URL": req.files.fileAudio[0].path,
                            "VIDEO_URL": req.files.fileVideo[0].path,
                            "VIDEO_MERGE_URL": videoMerged
                        })
                    }
                })


            })

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    resizingVideo: async (req, res) => {
        try {


            uploadFile(req, res, async (err) => {

                if (err) {
                    return res.status(403).json({
                        "message": err.message
                    })
                }

                if (!helperFunc.checkMimeTypeVideo(req.file)) {
                    return res.status(403).json({
                        "message": "input was not a video"
                    })
                }


                console.log(req.file)

                resizeVideoPath = `public/video/video-${uuid()}.mp4`

                resizeVideo(res, req.file.path, resizeVideoPath, req.body.displayResolution, null)

            })

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
}

module.exports = videoController;