import React from "react";
import Header from '../../components/Header/header.jsx'
import Footer from '../../components/Footer/footer.jsx'
import classes from "./restorePage.module.css"
import image from "../../assets/icons/derevo.svg"

const RestorePage = (props) => {
    return(
        <div className={classes.page}>
            <Header/>
            <img className={classes.image}src={image} alt=""/>
            <div className={classes.container_registration}>
                <div className={classes.form}>
                    <h1 className={classes.head_word}>Восстановление пароля</h1>
                    <div className={classes.wrapper_inputs}>
                        <label>
                            <p>Введите адрес электронной почты для восстановления пароля</p>                               
                            <p><input name="mail" type="email" placeholder="abc23s01@mail.com"
                                      className={classes.input}/></p>
                        </label>
                        <button type="submit" className={classes.button_sent}>Отправить</button>
                    </div>
                </div>
            </div>
            <Footer/>
         </div>
    )
};

export default RestorePage;