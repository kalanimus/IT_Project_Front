
import React, { useState } from 'react';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from './cabinetStudentPage.module.css';
import { useUser } from '../../context/UserContext.jsx';

const CabinetStudentPage = () => {
    const user = useUser();


  // моки
  const userInfo = {
    name: 'Каланчакаев Никита Михайлович',
    group: 'Группа СПНЗ-435',
    avatar: '/avatars/avatar-user.png',
    balance: 100500,
    trustRating: 5.0,
    login: 'abc23s01',
    email: 'abc23s01@bmstu.ru',
  };

  // стейты
  const [email, setEmail] = useState(userInfo.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);

  const [isEditingPwd, setIsEditingPwd] = useState(false);
  const [tempPwd, setTempPwd] = useState('');
  const [pwdSaved, setPwdSaved] = useState(false);

  // handlers
  const handleLogout = () => {
    user.logout(); // вызываем функцию logout из контекста
    // здесь будет очистка токена и редирект
  };

  const startEditEmail = () => {
    setTempEmail(email);
    setIsEditingEmail(true);
  };
  const saveEmail = () => {
    setEmail(tempEmail);
    setIsEditingEmail(false);
    console.log('new email:', tempEmail);
  };
  const cancelEmail = () => setIsEditingEmail(false);

  const startEditPwd = () => {
    setTempPwd('');
    setPwdSaved(false);
    setIsEditingPwd(true);
  };
  const savePwd = () => {
    setIsEditingPwd(false);
    setPwdSaved(true);
    console.log('new password:', tempPwd);
  };
  const cancelPwd = () => setIsEditingPwd(false);

  return (
    <div className={classes.page}>
      <Header />

      <main className={classes.main}>
        <h1 className={classes.title}>Личный кабинет</h1>

        <div className={classes.content}>
          {/* ——— ЛЕВАЯ КОЛОНКА ——— */}
          <div className={classes.left}>
            <img
              src={userInfo.avatar}
              alt={userInfo.name}
              className={classes.avatar}
            />
            <button className={classes.statBtn}>
              Баланс: {userInfo.balance.toLocaleString()} 🪙
            </button>
            <button className={classes.statBtn}>
              Рейтинг доверия: {userInfo.trustRating.toFixed(1)}
            </button>
            <button className={classes.logoutBtn} onClick={handleLogout}>
              Выйти из профиля
            </button>
          </div>

          {/* ——— ПРАВАЯ КОЛОНКА ——— */}
          <div className={classes.right}>
            <div className={classes.groupCard}>
              <div className={classes.groupCard_name}>{userInfo.name}</div>
              <div className={classes.groupCard_group}>{userInfo.group}</div>
            </div>

            <div className={classes.formSection}>
              {/* Логин (не редактируется) */}
              <div className={classes.fieldGroup}>
                <label className={classes.label}>Логин</label>
                <input
                  type="text"
                  className={classes.input}
                  value={userInfo.login}
                  readOnly
                />
              </div>
                {/* ПАРОЛЬ */}
                <div className={classes.fieldGroup}>
                <label className={classes.label}>Пароль</label>
                <input
                    type={isEditingPwd ? 'text' : 'password'}
                    className={classes.input}
                    value={isEditingPwd ? tempPwd : '••••••••••••••'}
                    onChange={e => setTempPwd(e.target.value)}
                    disabled={!isEditingPwd}
                />
                <div className={classes.buttonRow}>
                    {isEditingPwd ? (
                    <>
                        <button
                        className={classes.saveBtn}
                        onClick={savePwd}
                        disabled={!tempPwd}
                        >
                        Сохранить
                        </button>
                        <button
                        className={classes.cancelBtn}
                        onClick={cancelPwd}
                        >
                        Отмена
                        </button>
                    </>
                    ) : (
                    <button
                        className={classes.changeBtn}
                        onClick={startEditPwd}
                    >
                        Изменить пароль
                    </button>
                    )}
                </div>
                </div>

                {/* ЭЛЕКТРОННАЯ ПОЧТА */}
                <div className={classes.fieldGroup}>
                <label className={classes.label}>Электронная почта</label>
                <input
                    type="email"
                    className={classes.input}
                    value={isEditingEmail ? tempEmail : email}
                    onChange={e => setTempEmail(e.target.value)}
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
