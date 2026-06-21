const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../db");

const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

async function handleAuthentication(req, res) {
    if (req.user) return res.status(200).json(req.user);

    const { username, password, confirmedPassword } = req?.body;
    if (!username || !password) return res.status(400).end("Missing fields");

    if (!USERNAME_REGEX.test(username)) {
        return res
            .status(400)
            .end(
                "Username can only contain letters, numbers, underscores, hyphens, and periods.",
            );
    }

    if (confirmedPassword && confirmedPassword !== password) {
        console.log("Password does not match");
        return res.status(400).end("password does not match");
    }

    let foundUser;
    try {
        foundUser = await db("users")
            .select("id", "password_hash", "username", "image_url")
            .where({ username })
            .first();
    } catch (err) {
        console.log(err);
        return res.status(500).end();
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
        await db("auth.auth").insert({ username, token: refreshToken });
    } catch (e) {
        console.log(e);
        return res.status(500).end("Internal Server Error");
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
    let { username, password, avatar } = req?.body;
    username = username.trim().replace(/\s+/g, "").toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUrl =
        avatar ||
        `https://api.dicebear.com/9.x/adventurer/png?seed=${username}`;

    try {
        await db("users").insert({
            username,
            password_hash: hashedPassword,
            image_url: imageUrl,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).end("Server failure");
    }

    return res.status(204).end("Account created successfully");
}

async function handleSignout(req, res) {
    const { username } = req?.body;
    try {
        await db("auth.auth").where({ username }).del();

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
