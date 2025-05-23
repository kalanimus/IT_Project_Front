import Header from '../../components/Header/header.jsx'
import classes from "./registrationPage.module.css"
import Footer from '../../components/Footer/footer.jsx'
import { useNavigate } from "react-router-dom";
import React, { useCallback } from 'react';
import Cookies from 'js-cookie';
import image from "../../assets/icons/derevo.svg"
import { BASE_URL } from '../../config.js';

const RegistrationPage = () => {
    const navigate = useNavigate();

    const fetchRegistration = useCallback(async (login, password) => {
        const response = await fetch(`${BASE_URL}/Registration`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        const data = await response.json();

        if (response.ok) {
            Cookies.set("auth", data.Token);
            navigate("/Cabinet");
        } else {
            console.log("Неправильный пароль или login");
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const login = event.target.login.value;
        const password = event.target.password.value;

        fetchRegistration(login, password);
    };

    return (
        <div className={classes.page}>
            <Header />
            <img className={classes.image} src={image} alt=""/>
            <div className={classes.container_registration}>
                <div className={classes.form}>
                    <h1 className={classes.head_word}>Регистрация</h1>
                    <form onSubmit={handleSubmit} className={classes.wrapper_inputs}>
                        <label>
                            <p>Логин</p>
                            <p>
                                <input
                                    name="login"
                                    type="email"
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
                        <div className={classes.container_checkbox}>
                            <input name="confedencial" type="checkbox" className={classes.checkbox} />
                            <p className={classes.info_text}>
                                Нажимая на кнопку, вы даёте свое согласие на обработку
                                персональных данных и соглашаетесь с условиями <a
                                    href="" className={classes.rules_link}>политики конфиденциальности</a>.
                            </p>
                        </div>
                        <div className={classes.container_checkbox}>
                            <input name="rules" type="checkbox" className={classes.checkbox} />
                            <p className={classes.info_text}>
                                Я ознакомился с <a
                                    href=""
                                    className={classes.rules_link}>правилами</a> Web-платформы SHACT
                                и согласен с ними
                            </p>
                        </div>
                        <button type="submit" className={classes.button_sent}>Зарегистрироваться</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegistrationPage;
