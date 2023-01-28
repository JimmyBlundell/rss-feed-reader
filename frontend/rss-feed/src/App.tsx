import React, { useState, ChangeEvent, FormEvent } from "react";
import { ReactComponent as Logo } from "./logo.svg";
import FormInput from './components/form-input/form-input';
import Axios from "axios";

import './App.css';

// TypeScript declarations
type User = {
    id: number,
    username: string,
    password: string
}

const App = () => {
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
            console.log(JSON.stringify(response));
        });
    };

    const login = () => {
        Axios.post('http://localhost:8000/login', {
            username: username,
            password: password,
        }).then((response) => {
            if (response?.data?.message) {
                setLoginStatus(response.data.message);
            }
            else {
                setLoginStatus(response.data[0].username);
            }
        });
    };
    /**
     * TODO: Add form components back in possibly, for a page refresh / re route?
     */
    return (
        <div className='App-header'>
            <h1>
                { user && `Welcome! ${user.username}`}
            </h1>
            <div className="card">
                <Logo className="logo" />
                <h2>Register</h2>
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
            </div>
            <br/>
            <h4> OR </h4>
            <br/>
            <div className="card">
                <Logo className="logo" />
                <h2>Sign In</h2>
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
            </div>
            <h1>{loginStatus}</h1>
        </div>
    );
}

export default App;
