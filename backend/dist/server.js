"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const cors_1 = __importDefault(require("cors"));
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
    db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, password], (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.send({ message: "Username already exists!" });
        }
    });
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.send({ message: "Username and/or password is incorrect!" });
        }
    });
});
const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
