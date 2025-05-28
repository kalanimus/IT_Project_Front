import React, { useState } from "react";
import modalClasses from "./RegistrationModal.module.css";
import { getMe, register } from "../../api.ts";
import { useUser } from "../../context/UserContext.jsx";

const RegistrationForm = ({ onNeedVerification, onSuccess }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const login = event.target.login.value;
    const password = event.target.password.value;
    const password2 = event.target.password2.value;
    if (password !== password2) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }
    try {
      const response = await register(login, password);
      if (response.requireVerification) {
        onNeedVerification({ login, password });
      } else if (response.token) {
        const userData = await getMe();
        user.setUser(userData);
        onSuccess();
      } else {
        setError("Ошибка регистрации");
      }
    } catch (e) {
      setError("Ошибка регистрации");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={modalClasses.form}>
      <h1 className={modalClasses.head_word}>Регистрация</h1>
      <label className={modalClasses.label}>
        <p>Логин</p>
        <input
          name="login"
          type="text"
          placeholder="Логин KAS"
          className={modalClasses.input}
          required
        />
      </label>
      <label className={modalClasses.label}>
        <p>Пароль</p>
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          className={modalClasses.input}
          required
        />
      </label>
      <label className={modalClasses.label}>
        <p>Повтор пароля</p>
        <input
          name="password2"
          type="password"
          placeholder="Повторите пароль"
          className={modalClasses.input}
          required
        />
      </label>
      <div className={modalClasses.container_checkbox}>
        <input name="confedencial" type="checkbox" className={modalClasses.checkbox} required />
        <p className={modalClasses.info_text}>
          Нажимая на кнопку, вы даёте свое согласие на обработку персональных данных и соглашаетесь с условиями{" "}
          <a href="" className={modalClasses.rules_link}>политики конфиденциальности</a>.
        </p>
      </div>
      <div className={modalClasses.container_checkbox}>
        <input name="rules" type="checkbox" className={modalClasses.checkbox} required />
        <p className={modalClasses.info_text}>
          Я ознакомился с <a href="" className={modalClasses.rules_link}>правилами</a> Web-платформы KALM и согласен с ними
        </p>
      </div>
      <button type="submit" className={modalClasses.button_sent} disabled={loading}>
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
      {error && <div style={{color: "red", marginTop: 8}}>{error}</div>}
    </form>
  );
};

export default RegistrationForm;