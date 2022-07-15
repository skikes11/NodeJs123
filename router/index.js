const router = require("express").Router();

const audioRouter = require("./audioRouter");
const mediaRouter = require("./mediaRouter")

router.use("/media", mediaRouter);

module.exports = router