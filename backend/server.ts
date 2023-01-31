import dotenv from "dotenv";
import express, {Express, Request, Response} from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt, {hash} from 'bcrypt';

const saltRounds = 10;

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

    // See if username already exists
    db.query("SELECT username FROM users WHERE username = ?", [username], (err, result) => {
        // username is not taken
        if (result.length === 0) {
            bcrypt.hash(password, saltRounds, (err, hash) => {
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

        } else {
            res.send({message: "Username already exists!"});
        }
    });
});

app.post('/login', (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            res.send({err: err});
        }
        if (result.length > 0) {
            const pw = JSON.parse(JSON.stringify(result));
            bcrypt.compare(password, pw[0].password, (error, response) => {
                if (response) {
                    res.send(result);
                }
                else {
                    res.send({message: "User does not exist!"});
                }
            })
        }
    })
});

const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
