const express = require("express");
require("dotenv").config({ path: "../config.env" });
const CONFIG = process.env;

const router = express.Router();

router.get("/", (req, res) => {
  res.send({
    code: 200,
    message: "Hello World",
    data: {},
  });
});

module.exports = router;
