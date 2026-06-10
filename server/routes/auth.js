const express = require("express");
const multer = require("multer");

const authRouter = express.Router();

const {
    handleAuthentication,
    handleSignout,
} = require("../controllers/auth.controller.js");
const { refreshWithToken } = require("../middlewares/auth.middleware.js");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only image files (JPEG, PNG, GIF, WebP) are allowed",
                ),
            );
        }
    },
});

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
