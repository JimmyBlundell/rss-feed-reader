import React, { useState, ChangeEvent, FormEvent } from "react";
import { ReactComponent as Logo } from "./logo.svg";
import { getData } from "./utils/data-utils";
import FormInput from './components/form-input/form-input';

import './App.css';

// TypeScript declarations
type User = {
    id: number,
    username: string,
    password: string
}

const App = () => {
    const [user, setUser] = useState<User | null>();
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [ email, setEmail ] = useState('');
    const [password, setPassword] = useState('');


    const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const res:User = await getData(
                'http://localhost:8000/login', email, password
            )
            setUser(res);
            // resetLoginFields()
        } catch (error) {
            alert('User Sign In Failed');
        }
    };

    const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const res:User = await getData(
                'http://localhost:8000/login', emailReg, passwordReg
            )
            setUser(res);
            // resetRegisterFields()
        } catch (error) {
            alert('User Register Failed');
        }
    };

    const resetRegistration = () => {
        setEmailReg('');
        setPasswordReg('');
    }
    const resetLogin = () => {
        setEmail('');
        setPassword('');
    }

    return (
        <div className='App-header'>
            <h1>
                { user && `Welcome! ${user.username}`}
            </h1>
            <div className="card">
                <Logo className="logo" />
                <h2>Register</h2>
                <form onSubmit={handleRegisterSubmit} id={"registerForm"}>
                    <FormInput
                        label="Email"
                        type="email"
                        required
                        name="email"
                        value={emailReg}
                        onChange={(e) => {
                            setEmailReg(e.target.value);
                        }}
                        id={"registerEmail"}
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
                        <button type="submit">Register</button>
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
                <Logo className="logo" />
                <h2>Sign In</h2>
                <form onSubmit={handleLoginSubmit} id={"signInForm"}>
                    <FormInput
                        label="Email"
                        type="email"
                        required
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        id={"signInEmail"}
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
                        <button type="submit">Sign In</button>
                        <span>
                <button type="button" onClick={resetLogin}>Clear</button>
              </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
