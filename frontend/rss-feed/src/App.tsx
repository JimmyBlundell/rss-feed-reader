import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ErrorPage from "./Pages/ErrorPage";
import Axios from "axios";
import {NavDropdown} from "react-bootstrap";
import {useEffect, useState} from "react";

// logout button is in the nav bar, so need this function here.
function Logout(){
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
    const user = JSON.parse(localStorage.getItem("userInfo") as string);
    return (
        <Router>
            <Navbar bg={"dark"} variant={"dark"} style={{top: "-22px"}}>
                <Nav>
                    <Nav.Link href={"/"}>Add/View Feeds</Nav.Link>
                </Nav>
                {user ?
                    <Nav>
                        <NavDropdown title={user.username}>
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
    )
}


export default App;