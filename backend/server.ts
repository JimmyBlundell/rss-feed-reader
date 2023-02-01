import express from "express";
import cors from 'cors';
import UserRouter from "./routes/user";
import session from "express-session";
import 'reflect-metadata';
import { initDb } from "./db";
import crypto from "crypto";


console.log(crypto.randomBytes(64).toString('hex'));

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));
// having issues with cors requests and logout, this fixes it but
// is not safe. only used for dev purposes
app.use(express.json());

// Use express-session middleware
app.use(
    session({
        secret: "rssfeedreadersecret",
        resave: false,
        saveUninitialized: false,
        cookie: { expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
    })
);

app.use("/", UserRouter);

const runApp = async () => {
    await initDb();
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
}



runApp();