const express = require("express");
const path = require("path");
const multer = require("multer");

const authRouter = express.Router();

const {
    handleAuthentication,
    handleSignout,
} = require("../controllers/auth.controller.js");
const { refreshWithToken } = require("../middlewares/auth.middleware.js");

const storage = multer.diskStorage({
    destination: "avatars/",
    filename: (req, file, cb) => {
        let { username } = req.body;
        username = username.trim().replace(/\s+/g, "").toLowerCase();

        const fileExt = path.extname(file.originalname);
        cb(null, username + "-" + file.fieldname + fileExt);
    },
});

const upload = multer({ storage, limits: 1024 * 5 });

authRouter.post(
    "/auth",
    refreshWithToken,
    upload.single("avatar"),
    handleAuthentication,
);

authRouter.post("/auth/signout", handleSignout);

module.exports = {
    authRouter,
};
