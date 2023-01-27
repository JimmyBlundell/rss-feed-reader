import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello World From the Typescript Server!</h1>')
});

const port = 8000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


interface FormInputs {
    email: string,
    password: string
}

// Array of example users for testing purposes
const users = [
    {
        id: 1,
        name: 'Jimmy Blundell',
        email: 'jblundell123@gmail.com',
        password: 'jblundell'
    },
    {
        id: 2,
        name: 'Sharlene Ackman',
        email: 'sharleneackman@gmail.com',
        password: 'sharleneackman'
    }
];

// route login
app.post('/login', (req: Request, res: Response) => {
    const { email, password }:FormInputs = req.body;
    console.log({email, password});

    const user = users.find(user => {
        return user.email === email && user.password === password
    });

    if (!user) {
        return res.status(404).send('User Not Found!')
    }

    return res.status(200).json(user)
});

