const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

async function handleAuthentication(req, res) {
    if (req.user) return res.json(req.user);

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
            [username]
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
        foundUser.password_hash
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
        jwtOptions
    );

    try {
        await db.query("INSERT INTO auth(username, token) VALUES($1,$2)", [
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
    const { username, password } = req?.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    try {
        newUser = await db.query(
            "INSERT INTO users(username, password_hash, image_url) VALUES($1,$2,$3)",
            [username, hashedPassword, ""]
        );
    } catch (e) {
        console.log(e);
        return res.status(500).end("Server failure");
    }

    res.end();
}

module.exports = {
    handleAuthentication,
    signIn,
    signUp,
};
