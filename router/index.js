const router = require("express").Router();

const audioRouter = require("./audioRouter");
const mediaRouter = require("./mediaRouter")
const videoRouter = require("./videoRouter")


router.use("/media", mediaRouter);
router.use("/video", videoRouter);
router.use("/audio", audioRouter);

module.exports = router