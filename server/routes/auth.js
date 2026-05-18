const express = require("express");
const path = require("path");
const multer = require("multer");

const authRouter = express.Router();

const { handleAuthentication } = require("../controllers/auth.controller.js");
const { refreshWithToken } = require("../middlewares/auth.middleware.js");

const storage = multer.diskStorage({
    destination: "avatars/",
    filename: (req, file, cb) => {
        let { username } = req.body;
        username = username.trim().replace(/\s+/g, "").toLowerCase();
        console.log("Username: ", username);

        const fileExt = path.extname(file.originalname);
        cb(null, username + "-" + file.fieldname + fileExt);
    },
    limits: 1024,
});

const upload = multer({ dest: "avatars/", storage });

authRouter.post(
    "/auth",
    refreshWithToken,
    upload.single("avatar"),
    handleAuthentication,
);

module.exports = {
    authRouter,
};
