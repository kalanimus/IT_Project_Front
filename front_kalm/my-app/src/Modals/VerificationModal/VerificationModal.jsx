import React, { useState } from "react";
import classes from "./VerificationModal.module.css";
import { getMe, verify } from "../../api.ts";
import { useUser } from "../../context/UserContext.jsx";

const VerificationModal = ({ login, password, onSuccess }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await verify(login, password, code);
      if (response.token) {
        const userData = await getMe();
        user.setUser(userData);
        login(response.token);
        onSuccess();
      } else {
        setError("Неверный код");
      }
    } catch {
      setError("Ошибка верификации");
    }
    setLoading(false);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.title}>
        Вам на почту был отправлен код подтверждения.<br />
        Для завершения регистрации, пожалуйста,<br />
        введите его ниже.
      </div>
      <label className={classes.label}>
        Код подтверждения
      </label>
      <input
          className={classes.input}
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Проверочный код"
          required
        />
      <button className={classes.button} type="submit" disabled={loading}>
        {loading ? "Проверка..." : "Отправить"}
      </button>
      {error && <div className={classes.error}>{error}</div>}
    </form>
  );
};

export default VerificationModal;