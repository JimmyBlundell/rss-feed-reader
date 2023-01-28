import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import mysql from "mysql";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "rss-feed-db"
});

app.post('/register', (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, password], (err, result) => {
        if (err) {
            res.send({err: err});
        }
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({message: "Username already exists!"});
        }
    })
});

app.post('/login', (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) {
            res.send({err: err});
        }
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({message: "Username and/or password is incorrect!"});
        }
    })
});

const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
