const express = require("express");

const authRouter = express.Router();

const {
    handleAuthentication,
    handleSignout,
} = require("../controllers/auth.controller.js");
const { refreshWithToken } = require("../middlewares/auth.middleware.js");

authRouter.post("/auth", refreshWithToken, handleAuthentication);

authRouter.post("/auth/signout", handleSignout);

module.exports = {
    authRouter,
};
