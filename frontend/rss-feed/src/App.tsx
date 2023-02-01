import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ErrorPage from "./Pages/ErrorPage";
import Axios from "axios";

const user = JSON.parse(localStorage.getItem('user') as string);
console.log("user from app.tsx: ", user);

// logout button is in the nav bar, so need this function here.
const Logout = async () => {
    try {
        await Axios.get('http://localhost:8000/logout').then((response: any) => {
            console.log(response);
            localStorage.clear();
            window.location.href = "http://localhost:3000/login";
        }).catch((err: any) => {
            alert(err);
        });
    } catch (error) {
        alert(error)
    }
};

const App = () => {
    return (
        <Router>
            <Navbar bg={"dark"} variant={"dark"}>
                <Nav>
                    <Nav.Link href={"/"}>Home</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link onClick={Logout}>Log Out</Nav.Link>
                </Nav>
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