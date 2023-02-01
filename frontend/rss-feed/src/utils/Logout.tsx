import React from "react";
import Axios from "axios";

const Logout = async () => {
    try {
        await Axios.get('http://localhost:8000/logout').then((response) => {
            console.log(response);
            window.location.href = "http://localhost:3000/login";
        }).catch(err => {
            alert(err);
        });
    } catch (error) {
        alert(error)
    }
};

export default Logout;