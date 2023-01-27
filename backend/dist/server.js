"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('<h1>Hello World From the Typescript Server!</h1>');
});
const port = 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
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
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log({ email, password });
    const user = users.find(user => {
        return user.email === email && user.password === password;
    });
    if (!user) {
        return res.status(404).send('User Not Found!');
    }
    return res.status(200).json(user);
});
