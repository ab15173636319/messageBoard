const OSS = require("ali-oss")
require("dotenv").config({path: "./config.env"})

const CONFIG = process.env

const client = new OSS({
    accessKeyId: CONFIG.OSS_ACCESS_KEY_ID,
    accessKeySecret: CONFIG.OSS_ACCESS_KEY_SECRET,
    region: CONFIG.REGION,
    authorizationV4: true,
    bucket: CONFIG.BUCKET,
    endpoint: CONFIG.ENDPOINT,
})

module.exports = client