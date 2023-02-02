import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import {createContext, useState, Dispatch, SetStateAction} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ErrorPage from "./Pages/ErrorPage";
import Axios from "axios";
import {NavDropdown} from "react-bootstrap";

type SetUserState = (username: string) => void;
type SetUserIdState = (Dispatch<SetStateAction<null>>);

interface UserContextType {
    userId: number | null,
    username: string | undefined,
    setUser: SetUserState,
    setUserId: SetUserIdState
}

const Context = createContext<UserContextType | null>(null);

// logout button is in the nav bar, so need this function here.
function Logout() {
    try {
        Axios.get('http://localhost:8000/logout').then((response: any) => {
            console.log(response);
            localStorage.clear();
            window.location.href = "http://localhost:3000/login";
        }).catch((err: any) => {
            alert(err);
        });
    } catch (error) {
        alert(error)
    }
}

const App = () => {
    const [user, setUser] = useState('');
    const [userId, setUserId] = useState(null);
    return (
        <Context.Provider value={{username: user, userId: userId, setUser, setUserId}}>
            <Router>
                <Navbar bg={"dark"} variant={"dark"}>
                    <Nav>
                        <Nav.Link href={"/"}>Home</Nav.Link>
                    </Nav>
                    {!!user ?
                        <Nav>
                            <NavDropdown title={!!user}>
                                <NavDropdown.Item onClick={Logout}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        :
                        <Nav>
                            <Nav.Link href={"/login"}>Log In</Nav.Link>
                        </Nav>
                    }
                </Navbar>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"*"} element={<ErrorPage/>}/>
                </Routes>
            </Router>
        </Context.Provider>
    )
}


export default App;
export {Context};