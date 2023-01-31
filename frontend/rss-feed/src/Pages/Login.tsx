import React, {useState, ChangeEvent, FormEvent} from "react";
import FormInput from '../components/form-input/form-input';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Axios from "axios";

import './Login.css';

// TypeScript declarations
type User = {
    id: number,
    username: string,
    password: string
}

const Login = () => {
    const [user, setUser] = useState<User | null>();
    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    // disable register / login button until fields are filled out appropriately
    const fieldsValidation = (un: string, pw: string) => {
        return un.length > 0 && pw.length > 0;
    }

    const resetRegistration = () => {
        setUsernameReg('');
        setPasswordReg('');
    }
    const resetLogin = () => {
        setUsername('');
        setPassword('');
    }

    const register = () => {
        Axios.post('http://localhost:8000/register', {
            username: usernameReg,
            password: passwordReg,
        }).then((response) => {
            setLoginStatus(response?.data?.message ?? response?.data ?? "Something unknown occurred - uh oh.");
        });
    };

    const login = () => {
        Axios.post('http://localhost:8000/login', {
            username: username,
            password: password,
        }).then((response) => {
            if (response?.data?.message) {
                setLoginStatus(response.data.message);
            } else {
                setLoginStatus(`Logged in as ${response.data[0].username}`);
            }
        });
    };
    /**
     * TODO: Add form components back in possibly, for a page refresh / re route?
     */
    return (
        <div className='App-header'>
            <h1>
                {user && `Welcome! ${user.username}`}
            </h1>

            <div className="card">
                <h2>Register</h2>
                <form autoComplete={"on"}>
                    <FormInput
                        label="Username"
                        type="text"
                        required
                        name="text"
                        value={usernameReg}
                        onChange={(e) => {
                            setUsernameReg(e.target.value);
                        }}
                        id={"registerUsername"}
                    />
                    <FormInput
                        label="Password"
                        type='password'
                        required
                        name='password'
                        value={passwordReg}
                        onChange={(e) => {
                            setPasswordReg(e.target.value);
                        }}
                        id={"registerPassword"}
                    />
                    <div className="button-group">
                        <button
                            type="submit"
                            onClick={register}
                            disabled={!fieldsValidation(usernameReg, passwordReg)}
                        >
                            Register
                        </button>
                        <span>
                                <button type="button" onClick={resetRegistration}>Clear</button>
                            </span>
                    </div>
                </form>
            </div>

            <br/>
            <h4> OR </h4>
            <br/>
            <div className="card">
                <h2>Sign In</h2>
                <form autoComplete={"on"}>
                    <FormInput
                        label="Username"
                        type="text"
                        required
                        name="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        id={"signInUsername"}
                    />
                    <FormInput
                        label="Password"
                        type='password'
                        required
                        name='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        id={"signInPassword"}
                    />
                    <div className="button-group">
                        <button
                            type="submit"
                            onClick={login}
                            disabled={!fieldsValidation(username, password)}
                        >
                            Sign In
                        </button>
                        <span>
                            <button type="button" onClick={resetLogin}>Clear</button>
                        </span>
                    </div>
                </form>
            </div>
            <h1>{loginStatus}</h1>
        </div>
    );
}

export default Login;
