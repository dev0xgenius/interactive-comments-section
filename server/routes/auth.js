const express = require("express");
const authRouter = express.Router();

const { handleAuthentication } = require("../controllers/auth.controller.js");
const { refreshWithToken } = require("../middlewares/auth.middleware.js");

authRouter.post("/auth", refreshWithToken, handleAuthentication);

module.exports = {
    authRouter,
};
