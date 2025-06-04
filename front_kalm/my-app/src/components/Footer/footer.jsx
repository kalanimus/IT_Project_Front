import React from "react";
import classes from './footer.module.css';
import baumanLogo from "../../assets/icons/baumanLogo.svg"

const Footer = () => {
    return (
        <footer className={classes.footer}>
            <div className={classes.container_footer}>
                {/* Лого и копирайт */}
                <div className={classes.logo_block}>
                    <div className={classes.kalm_name}>KALM</div>
                    <img className={classes.baumanLogo} src={baumanLogo} alt=""/>
                    <div className={classes.copy}>2025. Все права защищены</div>
                </div>
                {/* О проекте */}
                <div className={classes.list_1}>
                    <h4>О проекте</h4>
                    <p>
                        KALM — сервис для повышения качества образования через прозрачную обратную связь между студентами и преподавателями. Студенты могут ознакомиться с реальным опытом других, а преподаватели — получить объективную обратную связь и развиваться в профессии. Образование начинается с диалога.
                    </p>
                </div>
                {/* Контакты разработчиков */}
                <div className={classes.list_contacts}>
                    <h4>Контакты</h4>
                    <p>
                        <a href="https://t.me/kalanimus" target="_blank" rel="noopener noreferrer">
                            Каланчекаев Никита — @kalanimus
                        </a><br/>
                        <a href="https://t.me/moryakkina" target="_blank" rel="noopener noreferrer">
                            Морякина Валерия — @moryakkina
                        </a><br/>
                        <a href="https://t.me/xrayyd" target="_blank" rel="noopener noreferrer">
                            Курская Анна — @xrayyd
                        </a>
                    </p>
                </div>
                {/* Адрес */}
                <div className={classes.list_4}>
                    <h4>Адрес</h4>
                    <p>105005, Москва, 2-я Бауманская ул., д. 5, стр. 1</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;