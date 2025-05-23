import Header from '../../components/Header/header.jsx'
import classes from "./loginPage.module.css"
import Footer from '../../components/Footer/footer.jsx'
import { useNavigate, Link } from "react-router-dom";
import React, { useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import image from "../../assets/icons/derevo.svg"
import { BASE_URL } from '../../config.js';

const LoginPage = () => {
    const navigate = useNavigate();

    const fetchLogin = useCallback(async (username, password) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            Cookies.set("auth", data.Token);
            console.log(data)
            navigate("/Survey");
        } else {
            console.log("Неправильный пароль или Email");
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.target.login.value;
        const password = event.target.password.value;
        fetchLogin(username, password);
    };

    const token = Cookies.get("auth");

    useEffect(() => {
        const fetchProtectedData = async () => {
            const response = await fetch(`${BASE_URL}/protected-route`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log(data);
        };

        if (token) fetchProtectedData();
    }, [token]);

    return (
        <div className={classes.page}>
            <Header />
            <img className={classes.image} src={image} alt=""/>
            <div className={classes.container_registration}>
                <div className={classes.form}>
                    <h1 className={classes.head_word}>Вход</h1>
                    <form onSubmit={handleSubmit} className={classes.wrapper_inputs}>
                        <label>
                            <p>Логин</p>
                            <p>
                                <input
                                    name="login"
                                    type="text"
                                    placeholder="abc23s01"
                                    className={classes.input}
                                />
                            </p>
                        </label>
                        <label>
                            <p>Пароль</p>
                            <p>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="qwerty12345"
                                    className={classes.input}
                                />
                            </p>
                        </label>
                        <Link to="/Restore">
                            <span className={classes.link_restore_password}>Забыли пароль?</span>
                        </Link>
                        <button type="submit" className={classes.button_sent}>Войти</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;
