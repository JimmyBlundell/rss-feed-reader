import React, {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import FormInput from '../components/form-input/form-input';
import {Button} from "react-bootstrap";
import Axios from "axios";
import {Context} from "../App";

import './Login.css';

// TypeScript declarations
type User = {
    id: number,
    username: string,
    password: string
}

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>();
    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const contextObject = useContext(Context);
    console.log("context user: ", contextObject?.username);

    // dictate whether register or login form is displayed
    const [needsRegister, setNeedsRegister] = useState(false);

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

    Axios.defaults.withCredentials = true;

    const register = async () => {
        await Axios.post('http://localhost:8000/register', {
            username: usernameReg,
            password: passwordReg,
        }).then((response) => {
            console.log("register response: ", response);
            setLoginStatus(response?.data?.user?.username ?? "Something unknown occurred - uh oh.");
            setNeedsRegister(false);
        }).catch(err => {
            alert(err.response.data);
        });
    };

    const login = async () => {
        await Axios.post('http://localhost:8000/login', {
            username: username,
            password: password,
        }).then((response) => {
            console.log("login response: ", response.data);
            localStorage.setItem("userInfo", JSON.stringify(response.data.responseObject));
            console.log("context object before: ", contextObject);
            contextObject?.setUser(JSON.stringify(response.data.responseObject.username));
            contextObject?.setUserId(response.data.responseObject.id);
            console.log("context object: ", contextObject);
            navigate("/");
        }).catch(err => {
            console.log("err login: ", err);
            alert(err.response.data);
        });
    };

    // run on first render to see if user session is still active - remove console log later
    // useEffect(() => {
    //     Axios.get("http://localhost:8000/isLoggedIn").then((response) => {
    //         console.log("isLoggedIn resonse: ", response);
    //         if (response.data.loggedIn === true) {
    //             setLoginStatus(`Logged in as ${response.data.user}`);
    //         }
    //     })
    // }, [])

    return (
        <div className='App-header'>
            {needsRegister ?
                <>
                    <div className="card">
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
                            id={"registerUsername"}/>
                        <FormInput
                            label="Password"
                            type='password'
                            required
                            name='password'
                            value={passwordReg}
                            onChange={(e) => {
                                setPasswordReg(e.target.value);
                            }}
                            id={"registerPassword"}/>
                        <div className={"button-group"}>
                            <Button
                                type="submit"
                                onClick={register}
                                disabled={!fieldsValidation(usernameReg, passwordReg)}
                                size={"lg"}
                            >
                                Register
                            </Button>
                            &nbsp;
                            <Button type="button" onClick={resetRegistration} size={"lg"}>Clear</Button>
                        </div>
                    </div>
                    <br/>
                    <span>
                        Already have an account?{' '}
                        <Button
                            variant="outline-primary" size={"sm"}
                            onClick={() => setNeedsRegister(false)}>Log In
                        </Button>
                    </span>
                </>
                :
                <>
                    <div className="card">
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
                            id={"signInUsername"}/>
                        <FormInput
                            label="Password"
                            type='password'
                            required
                            name='password'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            id={"signInPassword"}/>
                        <div className={"button-group"}>
                            <Button
                                type="submit"
                                onClick={login}
                                disabled={!fieldsValidation(username, password)}
                                size={"lg"}
                            >
                                Sign In
                            </Button>
                            &nbsp;
                            <Button type="button" onClick={resetLogin} size={"lg"}>Clear</Button>
                        </div>
                    </div>
                    <br/>
                    <span>
                        Need to create an account?{' '}
                        <Button
                            variant="outline-primary" size={"sm"}
                            onClick={() => setNeedsRegister(true)}>
                            Register here
                        </Button>
                    </span>
                </>
            }
            <h1>{loginStatus}</h1>
        </div>
    );
}

export default Login;
