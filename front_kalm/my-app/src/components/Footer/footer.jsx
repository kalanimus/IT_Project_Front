import React from "react";
import classes from './footer.module.css';
import { Link } from "react-router-dom";
import baumanLogo from "../../assets/icons/baumanLogo.svg"

const Footer = (props) =>{
    return (
        <footer className={classes.footer}>
            <div className={classes.container_footer}>
                <div className={classes.logo_block}>
                    <div className={classes.kalm_name}>KALM</div>
                    <img className={classes.baumanLogo} src={baumanLogo} alt=""/>
                    <div className={classes.copy}>2025. Все права защищены</div>
                </div>
                <div className={classes.list_1}>
                    <h4>О проекте</h4>
                    <p>
                        KALM — сервис для повышения качества образования через прозрачную обратную связь между студентами и преподавателями. Студенты могут ознакомиться с реальным опытом других, а преподаватели — получить объективную обратную связь и развиваться в профессии. Образование начинается с диалога.
                    </p>
                </div>
                <ul className={classes.list_2}>
                    <h4>Информация</h4>
                    <li><a href="">О проекте</a></li>
                    <li><Link to="/Hacktons">Преподаватели</Link></li>
                    <li><Link to="/SurveyTeacher">Опросы</Link></li>
                </ul>
                <ul className={classes.list_3}>
                    <h4>Социальные сети</h4>
                    <li><a href="">VKONTAKTE</a></li>
                    <li><a href="">Telegram</a></li>
                    <li><a href="">Discord</a></li>
                    <li><a href="">GitHub</a></li>
                </ul>
                <div className={classes.list_4}>
                    <h4>Адрес</h4>
                    <p>105005, Москва, 2-я Бауманская ул., д. 5, стр. 1</p>
                    <h4>Контакты</h4>
                    <p>8 (800) 555-35-35<br/>shact.project@bmstu.ru</p>
                </div>
            </div>
        </footer>

    );
};

export default Footer