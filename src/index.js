import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, RouterProvider } from "react-router-dom";
import App, {router} from './App';
import './index.css';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <RouterProvider router={router}>
            <Router>
                <App />
            </Router>
        </RouterProvider>
    </>
);