import React, { useState } from "react";
import classes from "./LoginModal.module.css";
import { getMe, login } from "../../api.ts";
import { useUser } from "../../context/UserContext.jsx";
import RecoverPasswordModal from "../RecoverPasswordModal/RecoverPasswordModal.jsx";

const LoginModal = ({ onNeedVerification, onSuccess, onRecoverPassword }) => {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(loginValue, password);
      if (response.requireVerification) {
        onNeedVerification({ login: loginValue, password });
      } else if (response.token) {
        user.login({ token: response.token, expiration: response.expiration });
        onSuccess();
      } else {
        setError("Неверный логин или пароль");
      }
    } catch {
      setError("Ошибка входа");
    }
    setLoading(false);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <h1 className={classes.head_word}>Вход</h1>
      <label className={classes.label}>
        <p>Логин</p>
        <input
          className={classes.input}
          type="text"
          placeholder="abc23s01"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
          required
        />
      </label>
      <label className={classes.label}>
        <p>Пароль</p>
        <input
          className={classes.input}
          type="password"
          placeholder="qwerty12345"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <div className={classes.forgot}>
        <a className={classes.forgot_link} onClick={onRecoverPassword}>
          Забыли пароль?
        </a>
      </div>
      <button className={classes.button} type="submit" disabled={loading}>
        {loading ? "Вход..." : "Войти"}
      </button>
      {error && <div className={classes.error}>{error}</div>}
    </form>
  );
};

export default LoginModal;
