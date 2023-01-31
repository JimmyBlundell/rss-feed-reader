import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ErrorPage from "./Pages/ErrorPage";

const App = () => {
    return (
        <Router>
            <Navbar bg={"dark"} variant={"dark"}>
                <Nav>
                    <Nav.Link href={"/"}>Home</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href={"/login"}>Log Out</Nav.Link>
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