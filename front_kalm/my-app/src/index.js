import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './pages/MainPage/mainPage';
import App from './appTemp';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <App/>
    </UserProvider>  
);