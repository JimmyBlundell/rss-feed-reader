import dotenv from "dotenv";
import express, {Express, Request, Response} from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "rssfeedreadersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // persist user for 2 weeks
        expires:  new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
}));

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "rss-feed-db"
});

const saltRounds = 10;

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
                    res.status(200).send("Successfully registered " + username + "!");
                });
            });

        } else {
            res.send({message: "Username already exists!"});
        }
    });
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        // if our session already has a user, send true to the frontend
        // frontend runs this get login on first render, so will have user data if cookie has not expired.
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false});
    }
})

app.post('/login', (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // parse result string to grab properties easily
            const resString = JSON.parse(JSON.stringify(result));
            bcrypt.compare(password, resString[0].password, (error, response) => {
                if (response) {
                    // set our session's user to the result's username
                    req.session.user = resString[0].username;
                    res.send(result);
                }
                else {
                    res.send({message: "Username and/or password is incorrect !"});
                }
            })
        }
        else {
            res.send({message: "Username and/or password is incorrect !"});
        }
    })
});

const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
