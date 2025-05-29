import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/header.jsx";
import Footer from "../../components/Footer/footer.jsx";
import classes from "./cabinetStudentPage.module.css";
import { useUser } from "../../context/UserContext.jsx";
import { updateUserPartial } from "../../api.ts";

const CabinetStudentPage = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Email
  const [email, setEmail] = useState(user.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);

  // Пароль
  const [isEditingPwd, setIsEditingPwd] = useState(false);
  const [tempPwd, setTempPwd] = useState("");
  const [repeatPwd, setRepeatPwd] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // handlers
  const handleLogout = () => {
    logout();
    navigate("/"); // редирект на главную
  };

  // Email
  useEffect(() => {
    setEmail(user.email || "");
    setTempEmail(user.email || "");
  }, [user.email]);

  const startEditEmail = () => {
    setTempEmail(email);
    setIsEditingEmail(true);
  };

  const saveEmail = async () => {
  try {
    await updateUserPartial({
      id: user.id,
      email: tempEmail,
      roleId: user.roleId,
      roleName: user.roleName,
    });
    setIsEditingEmail(false); // скрываем поля редактирования
    setEmail(tempEmail);      // обновляем email на новый
    // tempEmail не сбрасываем!
  } catch (error){
    console.log("Ошибка при обновлении email", error);
    // обработка ошибки
  }
  };
  const cancelEmail = () => {
    setIsEditingEmail(false);
    setTempEmail(email); // возвращаем tempEmail к текущему email только при отмене
  };

  // Пароль
  const startEditPwd = () => {
    setTempPwd("");
    setRepeatPwd("");
    setPwdSaved(false);
    setPwdError("");
    setIsEditingPwd(true);
  };
  const savePwd = async () => {
  setPwdLoading(true);
  setPwdError("");
  try {
    await updateUserPartial({
      id: user.id,
      password: tempPwd,
      roleId: user.roleId,
      roleName: user.roleName,
    });
    setIsEditingPwd(false); // скрываем поля редактирования
    setPwdSaved(true);
    setTempPwd("");
    setRepeatPwd("");
  } catch {
    setPwdError("Ошибка при обновлении пароля");
  }
  setPwdLoading(false);
  };
  const cancelPwd = () => {
    setIsEditingPwd(false);
    setTempPwd("");
    setRepeatPwd("");
    setPwdError("");
  };

  // Валидация совпадения паролей
  const isPwdValid = tempPwd && repeatPwd && tempPwd === repeatPwd;
  const isTeacher = user.roleName === "Преподаватель";

  return (
    <div className={classes.page}>
      <Header />

      <main className={classes.main}>
        <h1 className={classes.title}>Личный кабинет</h1>

        <div className={classes.content}>
          {/* ——— ЛЕВАЯ КОЛОНКА ——— */}
          <div className={classes.left}>
            <img
              src={"/avatars/StudentAvatarMock.png"}
              alt={user.fullName}
              className={classes.avatar}
            />
            <button className={classes.statBtn}>
              Баланс: {user.balance?.toLocaleString() ?? 0} 🪙
            </button>
            <button className={classes.statBtn}>
              {isTeacher
                ? `Рейтинг: ${user.rating?.toFixed(1) ?? "0.0"}`
                : `Рейтинг доверия: ${user.rating?.toFixed(1) ?? "0.0"}`}
            </button>
            <button className={classes.logoutBtn} onClick={handleLogout}>
              Выйти из профиля
            </button>
          </div>

          {/* ——— ПРАВАЯ КОЛОНКА ——— */}
          <div className={classes.right}>
            <div className={classes.groupCard}>
              <div className={classes.groupCard_name}>{user.fullName}</div>
              <div className={classes.groupCard_group}>{user.roleName}</div>
            </div>

            <div className={classes.formSection}>
              {/* Логин (не редактируется) */}
              <div className={classes.fieldGroup}>
                <label className={classes.label}>Логин</label>
                <input
                  type="text"
                  className={classes.input}
                  value={user.username}
                  readOnly
                />
              </div>
              {/* ПАРОЛЬ */}
              <div className={classes.fieldGroup}>
                <label className={classes.label}>Пароль</label>
                {isEditingPwd ? (
                  <>
                    <input
                      type="password"
                      className={classes.input}
                      placeholder="Новый пароль"
                      value={tempPwd}
                      onChange={(e) => setTempPwd(e.target.value)}
                    />
                    <input
                      type="password"
                      className={classes.input}
                      placeholder="Повторите пароль"
                      value={repeatPwd}
                      onChange={(e) => setRepeatPwd(e.target.value)}
                      style={{ marginTop: 8 }}
                    />
                    {tempPwd && repeatPwd && tempPwd !== repeatPwd && (
                      <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                        Пароли не совпадают
                      </div>
                    )}
                    {pwdError && (
                      <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                        {pwdError}
                      </div>
                    )}
                    <div className={classes.buttonRow}>
                      <button
                        className={classes.saveBtn}
                        onClick={savePwd}
                        disabled={!isPwdValid || pwdLoading}
                      >
                        {pwdLoading ? "Сохранение..." : "Сохранить"}
                      </button>
                      <button
                        className={classes.cancelBtn}
                        onClick={cancelPwd}
                        disabled={pwdLoading}
                      >
                        Отмена
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      type="password"
                      className={classes.input}
                      value={"••••••••••••••"}
                      readOnly
                      disabled
                    />
                    <button
                      className={classes.changeBtn}
                      onClick={startEditPwd}
                    >
                      Изменить пароль
                    </button>
                  </div>
                )}
                {pwdSaved && !isEditingPwd && (
                  <div style={{ color: "green", fontSize: 13, marginTop: 4 }}>
                    Пароль успешно изменён!
                  </div>
                )}
              </div>

              {/* ЭЛЕКТРОННАЯ ПОЧТА */}
              <div className={classes.fieldGroup}>
                <label className={classes.label}>Электронная почта</label>
                <input
                  type="email"
                  className={classes.input}
                  value={isEditingEmail ? tempEmail : email}
                  onChange={(e) => setTempEmail(e.target.value)}
                  disabled={!isEditingEmail}
                />
                <div className={classes.buttonRow}>
                  {isEditingEmail ? (
                    <>
                      <button
                        className={classes.saveBtn}
                        onClick={saveEmail}
                        disabled={!tempEmail}
                      >
                        Сохранить
                      </button>
                      <button
                        className={classes.cancelBtn}
                        onClick={cancelEmail}
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <button
                      className={classes.changeBtn}
                      onClick={startEditEmail}
                    >
                      Изменить почту
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CabinetStudentPage;