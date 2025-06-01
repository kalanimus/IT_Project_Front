import React, { useState } from "react";
import classes from "./RecoverPasswordModal.module.css";
import { recoverPassword } from "../../api.ts";

const RecoverPasswordModal = ({ onClose }) => {
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await recoverPassword(login);
      setMessage("Новый пароль отправлен на вашу почту, если такой пользователь существует.");
    } catch (e) {
      setMessage("Ошибка восстановления пароля. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modal}>
        <button className={classes.closeBtn} onClick={onClose}>×</button>
        <h2 className={classes.title}>Восстановление пароля</h2>
        <form className={classes.form} onSubmit={handleSubmit}>
          <label className={classes.label}>Логин</label>
          <input
            className={classes.input}
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="Введите ваш логин"
            required
          />
          <button className={classes.submitBtn} type="submit" disabled={loading}>
            {loading ? "Отправка..." : "Отправить новый пароль"}
          </button>
        </form>
        {message && <div className={classes.message}>{message}</div>}
      </div>
    </div>
  );
};

export default RecoverPasswordModal;