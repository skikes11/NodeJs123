const router = require("express").Router();

const audioRouter = require("./audioRouter");
const mediaRouter = require("./mediaRouter")
const videoRouter = require("./videoRouter")
const imageRouter = require("./imageRouter")

router.use("/media", mediaRouter);
router.use("/video", videoRouter);
router.use("/audio", audioRouter);
router.use("/image", imageRouter);


module.exports = router