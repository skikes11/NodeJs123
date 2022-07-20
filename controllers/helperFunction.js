
const ffprobestatic = require('ffprobe-static')
const ffprobe = require('ffprobe')


const helperFunc = {
    getMediaType: (file) => {
        if (file.mimetype == "audio/mpeg" || file.mimetype == "audio/x-aiff" || file.mimetype == "application/ogg" || file.mimetype == "audio/mp4") {
            return "audio"
        } else if (file.mimetype == "video/mpeg" || file.mimetype == "video/mp4" || file.mimetype == "video/quicktime" || file.mimetype == "video/x-msvideo") {
            return "video"
        } else if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/tiff" || file.mimetype == "image/gif") {
            return "image"
        } else {
            return false
        }
    },
    getMediaInfor: (req, res, path) => {
        ffprobe(path, { path: ffprobestatic.path }, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
                return res.status(200).json({
                    "MEDIA_URL": path,
                    "info": info
                })
            }
        });
    },
    checkVideoFormat: (req) => {
        if (req.body.convertType == "mov" || req.body.convertType == "mp4" || req.body.convertType == "wmv" || req.body.convertType == "avi" || req.body.convertType == "mpg"  || req.body.convertType == "mpeg" || req.body.convertType == "smil" ) {
            return true
        } else {
            return false
        }
    },
    checkAudioFormat: (req) => {
        if (req.body.convertType == "wav" || req.body.convertType == "aiff" || req.body.convertType == "mp3" || req.body.convertType == "m4a" || req.body.convertType == "ogg" || req.body.convertType == "mp2" ) {
            return true
        } else {
            return false
        }
    },
    checkMimeTypeVideo: (file) => {
        if (file.mimetype == "video/mpeg" || file.mimetype == "video/mp4" || file.mimetype == "video/quicktime" || file.mimetype == "video/x-msvideo") {
            return true
        }else{
            return false
        }
    },
    checkMimeTypeAudio: (file) => {
        if (file.mimetype == "audio/mpeg" || file.mimetype == "audio/x-aiff" || file.mimetype == "application/ogg" || file.mimetype == "audio/mp4") {
            return true
        }else{
            return false
        }
    },
    checkMimeTypeImage: (file) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/tiff" || file.mimetype == "image/gif") {
            return true
        }else{
            return false
        }
    }

}


module.exports = helperFunc