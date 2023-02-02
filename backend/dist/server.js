"use strict";
// import dotenv from "dotenv";
// import express, {Express, Request, Response} from "express";
// import mysql from "mysql";
// import cors from "cors";
// import bcrypt from 'bcrypt';
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import session from "express-session";
//
// dotenv.config();
//
// const app: Express = express();
// app.use(express.json());
// app.use(cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true
// }));
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: true}));
//
// app.use(session({
//     secret: "rssfeedreadersecret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         // persist user for 2 weeks
//         expires:  new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
//     }
// }));
//
// const db = mysql.createConnection({
//     user: "root",
//     host: "localhost",
//     password: "password",
//     database: "rss-feed-db"
// });
//
// const saltRounds = 10;
//
// app.post('/register', (req, res) => {
//     const username: string = req.body.username;
//     const password: string = req.body.password;
//
//     // See if username already exists
//     db.query("SELECT username FROM users WHERE username = ?", [username], (err, result) => {
//         // username is not taken
//         if (result.length === 0) {
//             bcrypt.hash(password, saltRounds, (err, hash) => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, hash], (err, result) => {
//                     res.status(200).send("Successfully registered " + username + "!");
//                 });
//             });
//
//         } else {
//             res.send({message: "Username already exists!"});
//         }
//     });
// });
//
// app.get("/login", (req, res) => {
//     if (req.session.user) {
//         // if our session already has a user, send true to the frontend
//         // frontend runs this get login on first render, so will have user data if cookie has not expired.
//         res.send({loggedIn: true, user: req.session.user})
//     } else {
//         res.send({loggedIn: false});
//     }
// })
//
// app.post('/login', (req, res) => {
//     const username: string = req.body.username;
//     const password: string = req.body.password;
//     db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
//         if (err) {
//             throw err;
//         }
//         if (result.length > 0) {
//             // parse result string to grab properties easily
//             const resString = JSON.parse(JSON.stringify(result));
//             bcrypt.compare(password, resString[0].password, (error, response) => {
//                 if (response) {
//                     // set our session's user to the result's username
//                     req.session.user = resString[0].username;
//                     res.send(result);
//                 }
//                 else {
//                     res.send({message: "Username and/or password is incorrect !"});
//                 }
//             })
//         }
//         else {
//             res.send({message: "Username and/or password is incorrect !"});
//         }
//     })
// });
//
// const port = 8000;
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// });
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const rssfeed_1 = __importDefault(require("./routes/rssfeed"));
const express_session_1 = __importDefault(require("express-session"));
require("reflect-metadata");
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));
// having issues with cors requests and logout, this fixes it but
// is not safe. only used for dev purposes
app.use(express_1.default.json());
// Use express-session middleware
app.use((0, express_session_1.default)({
    secret: "rssfeedreadersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
}));
app.use("/", user_1.default, rssfeed_1.default);
const runApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.initDb)();
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
});
runApp();
