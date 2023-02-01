import React from "react";
import Axios from "axios";

const Logout = () => {
    Axios.get('http://localhost:8000/logout').then((response) => {
        console.log("logout response: ", response);
        window.location.href = "http://localhost:3000/login";
    }).catch(err => {
        alert(err);
    });
};

export default Logout;