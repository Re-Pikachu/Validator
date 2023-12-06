import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
//we didnt need to import {createRoot} individually since we imported in the whole module

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
