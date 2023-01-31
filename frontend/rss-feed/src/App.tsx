import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ErrorPage from "./Pages/ErrorPage";

const App = () => {
    return (
        <Router>
            <nav>
                <Link to={'/'}> Home </Link>
            </nav>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"*"} element={<ErrorPage/>}/>
            </Routes>
        </Router>
    )
}


export default App;