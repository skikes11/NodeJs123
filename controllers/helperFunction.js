
const ffprobestatic = require('ffprobe-static')
const ffprobe = require('ffprobe')


const helperFunc = {
    getMediaType : (file)=> {
        if(file.mimetype == "audio/mpeg" || file.mimetype == "audio/x-aiff" ||  file.mimetype == "application/ogg" || file.mimetype == "audio/mp4" ){
            return "audio"
        }else  if(file.mimetype == "video/mpeg" || file.mimetype == "video/mp4" ||  file.mimetype == "video/quicktime" || file.mimetype == "video/x-msvideo" ){
            return "video"
        }else  if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" ||  file.mimetype == "image/tiff" || file.mimetype == "image/gif" ){
            return "image"
        }else{
            return false
        }
    },
    getMediaInfor : (req,res, path) => { 
        console.log("#####"+file)
        ffprobe(path, { path: ffprobestatic.path }, (err, info) => {
            if (err) {
              console.log(err);
            } else {
                console.log(info);
                return res.status(200).json({
                    "info" :info
                })
            }
          });
    }
}


module.exports = helperFunc