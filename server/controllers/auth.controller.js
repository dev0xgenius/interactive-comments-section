const fsPromises = require("fs/promises");
const path = require("path");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

async function handleAuthentication(req, res) {
    if (req.user) return res.status(200).json(req.user);

    const { username, password, confirmedPassword } = req?.body;
    if (!username || !password) return res.status(400).end("Missing fields");

    if (confirmedPassword && confirmedPassword !== password) {
        console.log("Password does not match");
        return res.status(400).end("password does not match");
    }

    let foundUser;
    try {
        foundUser = await db.query(
            "SELECT id,password_hash,username,image_url FROM users WHERE username=$1",
            [username],
        );

        foundUser = foundUser.rows[0];
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }

    if (!foundUser) {
        return confirmedPassword
            ? await signUp(req, res)
            : res.status(401).end("User not found");
    }

    const passwordMatched = await bcrypt.compare(
        password,
        foundUser.password_hash,
    );

    if (!passwordMatched) return res.status(403).end("Invalid Credentials");

    req.user = foundUser;
    await signIn(req, res);
}

async function signIn(req, res) {
    const { username, image_url, id } = req.user;
    const payload = {
        id,
        image: { png: image_url },
        username,
    };

    const jwtOptions = { expiresIn: process.env.JWT_EXPIRES_IN };

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        jwtOptions,
    );

    try {
        await db.query("INSERT INTO auth.auth(username, token) VALUES($1,$2)", [
            username,
            refreshToken,
        ]);
    } catch (e) {
        console.log(e);
        console.log("DB error");
        res.status(500).end("Internal Server Error");
    }

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(payload);
}

async function signUp(req, res) {
    let { username, password } = req?.body;
    username = username.trim().replace(/\s+/g, "").toLowerCase();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    const imageUrl = req?.file.path;

    try {
        newUser = await db.query(
            "INSERT INTO users(username, password_hash, image_url) VALUES($1,$2,$3) RETURNING *",
            [username, hashedPassword, imageUrl || "avatars/test-avatar.jpg"],
        );
    } catch (e) {
        console.log(e);
        req?.file && fsPromises.unlink(path.join(req?.file.path));
        return res.status(500).end("Server failure");
    }

    return res.status(204).end("Account created successfully");
}

async function handleSignout(req, res, next) {
    const { username } = req?.body;
    try {
        await db.query("DELETE FROM auth.auth WHERE username=$1", [username]);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return res.status(204).end();
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).end("Internal Server Error");
    }
}

module.exports = {
    handleSignout,
    handleAuthentication,
    signIn,
    signUp,
};
