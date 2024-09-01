import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";

const container = document.getElementById('root');
createRoot(container).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
// ReactDOM.render(
//         <App />
//     document.getElementById("root")
// );