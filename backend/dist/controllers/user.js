"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.isLoggedIn = exports.loginUser = exports.registerUser = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../models/user");
const bcrypt = __importStar(require("bcrypt"));
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Missing username or password');
        }
        try {
            const userRepository = (0, typeorm_1.getRepository)(user_1.User);
            const existingUser = yield userRepository.findOne({ where: { username } });
            if (existingUser) {
                return res.status(409).send('Username already exists');
            }
            const hashedPassword = yield bcrypt.hash(password, 10);
            const newUser = userRepository.create({ username, password: hashedPassword });
            yield userRepository.save(newUser);
            res.json({ message: `User '${username}' created successfully`, user: newUser });
        }
        catch (error) {
            console.log("Error: ", error.message);
            res.status(500).send("Server Error on Register");
        }
    });
}
exports.registerUser = registerUser;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Missing username or password');
        }
        try {
            const userRepository = (0, typeorm_1.getRepository)(user_1.User);
            const user = yield userRepository.findOne({ where: { username } });
            if (!user) {
                return res.status(401).send('Invalid username or password');
            }
            else {
                const resString = JSON.parse(JSON.stringify(user));
                const isPasswordValid = yield bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).send('Invalid username or password');
                }
                else {
                    console.log("resString from loginUser in express: ", resString);
                    req.session.user = resString.username;
                }
            }
            const responseObject = { username: user.username, id: user.id };
            res.json({ message: 'Successful login', responseObject });
        }
        catch (error) {
            console.log("Error: ", error.message);
            res.status(500).send("Server Error on Login");
        }
    });
}
exports.loginUser = loginUser;
function isLoggedIn(req, res) {
    if (req.session.user) {
        // if our session already has a user, send true to the frontend
        // frontend runs this get login on first render, so will have user data if cookie has not expired.
        res.send({ loggedIn: true, user: req.session.user });
    }
    else {
        res.send({ loggedIn: false });
    }
}
exports.isLoggedIn = isLoggedIn;
function logout(req, res) {
    try {
        if (req.session && req.session.cookie) {
            res.cookie('connect.sid', null, {
                expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            });
            req.session.destroy((error) => {
                if (error) {
                    res.status(400).send('Unable to log out');
                }
                else {
                    res.send("Logout successful");
                }
            });
        }
    }
    catch (error) {
        console.log("Logout error: ", error);
        res.send(error);
    }
}
exports.logout = logout;
