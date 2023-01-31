"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: "rssfeedreadersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // persist user for 2 weeks
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
}));
const db = mysql_1.default.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "rss-feed-db"
});
const saltRounds = 10;
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // See if username already exists
    db.query("SELECT username FROM users WHERE username = ?", [username], (err, result) => {
        // username is not taken
        if (result.length === 0) {
            bcrypt_1.default.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, hash], (err, result) => {
                    res.status(200).send("Successfully registered " + username + "!");
                });
            });
        }
        else {
            res.send({ message: "Username already exists!" });
        }
    });
});
app.get("/login", (req, res) => {
    if (req.session.user) {
        // if our session already has a user, send true to the frontend
        // frontend runs this get login on first render, so will have user data if cookie has not expired.
        res.send({ loggedIn: true, user: req.session.user });
    }
    else {
        res.send({ loggedIn: false });
    }
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // parse result string to grab properties easily
            const resString = JSON.parse(JSON.stringify(result));
            bcrypt_1.default.compare(password, resString[0].password, (error, response) => {
                if (response) {
                    // set our session's user to the result's username
                    req.session.user = resString[0].username;
                    res.send(result);
                }
                else {
                    res.send({ message: "Username and/or password is incorrect !" });
                }
            });
        }
        else {
            res.send({ message: "Username and/or password is incorrect !" });
        }
    });
});
const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
