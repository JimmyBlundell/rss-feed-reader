import {getRepository} from 'typeorm';
import {User} from '../models/user';
import * as bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function registerUser(req: any, res: any) {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    try {
        const userRepository = getRepository(User);
        const existingUser = await userRepository.findOne({where: {username}});

        if (existingUser) {
            return res.status(409).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({username, password: hashedPassword});
        await userRepository.save(newUser);

        res.json({message: `User '${username}' created successfully`, user: newUser});
    } catch (error: any) {
        console.log("Error: ", error.message);
        res.status(500).send("Server Error on Register")
    }
}

export async function loginUser(req: any, res: any) {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({where: {username}});

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        const resString = JSON.parse(JSON.stringify(user));
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or password');
        }


        const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
        // @ts-ignore
        const token = jwt.sign({id: user.id, user: user.username}, jwtTokenSecret, {expiresIn: "1d"});

        console.log("user: ", user);

        res.json({message: 'Successful login', user: user.username, token: token});
    } catch (error: any) {
        console.log("Error: ", error.message);
        res.status(500).send("Server Error on Login");
    }
}

export function isLoggedIn(req: any, res: any) {
    if (req.session.user) {
        // if our session already has a user, send true to the frontend
        // frontend runs this get login on first render, so will have user data if cookie has not expired.
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false});
    }
}

export function logout(req: any, res: any) {
    try {
        if (req.session && req.session.cookie) {
            res.cookie('connect.sid', null, {
                expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            });

            req.session.destroy((error: any) => {
                if (error) {
                    res.status(400).send('Unable to log out');
                } else {
                    res.send("Logout successful");

                }
            });
        }
    } catch (error) {
        console.log("Logout error: ", error);
        res.send(error);
    }
}

// protected route
export async function profile(req: any, res: any) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({where: {id: req.user}});
    if (user) {
        return res.json({user: user.username})
    }
}

// authorize user - will I use this?
export function auth(req: any, res: any, next: any) {
     const token = req.headers.authorization;
     console.log("token: ", token);
     if (!token) {
         return res.status(401).json({message: "Unauthorized"});
     }
     // @ts-ignore
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, payload: any) => {
        if (err) {
            return res.status(403).json({message: "Unauthorized"});
        }
        req.user = payload.id;
        next();
    });


}