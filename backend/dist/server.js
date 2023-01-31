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
const saltRounds = 10;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const db = mysql_1.default.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "rss-feed-db"
});
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
                    // if (err) {
                    //     res.send({err: err});
                    // }
                    res.status(200).send("Successfully registered " + username + "!");
                    console.log("Result: ", result);
                });
            });
        }
        else {
            res.send({ message: "Username already exists!" });
        }
    });
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            const pw = JSON.parse(JSON.stringify(result));
            bcrypt_1.default.compare(password, pw[0].password, (error, response) => {
                if (response) {
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
