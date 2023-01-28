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
})

const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
