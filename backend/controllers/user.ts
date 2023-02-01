import { getRepository } from 'typeorm';
import { User } from '../models/user';
import * as bcrypt from 'bcrypt';

export async function registerUser(req: any, res: any) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    try {
        const userRepository = getRepository(User);
        const existingUser = await userRepository.findOne({ where: { username } });

        if (existingUser) {
            return res.status(409).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({ username, password: hashedPassword });
        await userRepository.save(newUser);

        res.send(`User '${username}' created successfully`);
    } catch(error: any) {
        console.log("Error: ", error.message);
        res.status(500).send("Server Error on Register")
    }
}

export async function loginUser(req: any, res: any) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { username } });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or password');
        }

        res.send('Successful login');
    } catch (error: any){
        console.log("Error: ", error.message);
        res.status(500).send("Server Error on Login");
    }
}

export function isLoggedIn( req: any, res: any) {
    if (req.session.user) {
        // if our session already has a user, send true to the frontend
        // frontend runs this get login on first render, so will have user data if cookie has not expired.
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false});
    }
}