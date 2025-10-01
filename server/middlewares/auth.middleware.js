const db = require("../db");
const jwt = require("jsonwebtoken");

async function refreshWithToken(req, res, next) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return next();

    let foundUser;
    try {
        foundUser = await db.query("SELECT * FROM auth WHERE token=$1", [
            refreshToken,
        ]);

        foundUser = foundUser.rows[0];
        if (!foundUser) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            });

            return next();
        }
    } catch (e) {
        console.log(e);
        return res.status(500).end("Internal Server error");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    if (foundUser.username !== decoded.username) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return next();
    }

    req.user = decoded;
    return next();
}

module.exports = {
    refreshWithToken,
};
