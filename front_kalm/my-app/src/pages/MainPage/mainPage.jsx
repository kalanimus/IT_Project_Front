import React, { useState } from "react";
import Header from "../../components/Header/header.jsx";
import classes from "./mainPage.module.css";
import image from "../../assets/icons/derevo.svg";
import Footer from "../../components/Footer/footer.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../../Modals/RegistrationModal/RegistrationModal.jsx";
import Modal from "../../Modals/BaseModal/Modal.jsx";
import VerificationModal from "../../Modals/VerificationModal/VerificationModal.jsx";
import LoginModal from "../../Modals/LoginModal/LoginModal.jsx";

const MainPage = (props) => {
  const [modalType, setModalType] = useState(null); // 'register' | 'login' | 'verify'
  const [verificationData, setVerificationData] = useState(null); // { login }
  const navigate = useNavigate();

  const goToMainAuthPage = () => {
    setModalType(null);
    setVerificationData(null);
    navigate("/MainAuthPage");
  };
  return (
    <div className={classes.main_page}>
      <Header />

      <div className={classes.all_block}>
        <img className={classes.image} src={image} alt="" />
        <div className={classes.right_block}>
          <h1 className={classes.kalm_text}>KALM</h1>
          <p className={classes.kalm_text2}>Knowledge Assessment</p>
          <p className={classes.kalm_text2}>& Learning Monitoring</p>
          <section className={classes.kalm_text_information}>
            <p>
              Сервис для повышения качества образования через прозрачную
              обратную связь между студентами и преподавателями.
            </p>
            <p>
              Студенты могут ознакомиться с реальным опытом других, а
              преподаватели — получить объективную обратную связь и развиваться
              в профессии.
            </p>
            <p>Образование начинается с диалога</p>
          </section>
          <div className={classes.claster_buttons}>
            <button
              className={classes.button2}
              onClick={() => setModalType("register")}
            >
              Регистрация
            </button>
            <button
              className={classes.button1}
              onClick={() => setModalType("login")}
            >
              Вход
            </button>
          </div>
        </div>
      </div>
      <Footer />
      {modalType === "register" && (
        <Modal onClose={() => setModalType(null)}>
          <RegistrationForm
            onNeedVerification={({ login, password }) => {
              setVerificationData({ login, password });
              setModalType("verify");
            }}
            onSuccess={goToMainAuthPage}
          />
        </Modal>
      )}
      {modalType === "verify" && (
        <Modal disableClose>
          <VerificationModal
            login={verificationData?.login}
            password={verificationData?.password}
            onSuccess={goToMainAuthPage}
          />
        </Modal>
      )}
      {modalType === "login" && (
        <Modal onClose={() => setModalType(null)}>
          <LoginModal
            onNeedVerification={({ login, password }) => {
              setVerificationData({ login, password });
              setModalType("verify");
            }}
            onSuccess={goToMainAuthPage}
          />
        </Modal>
      )}
    </div>
  );
};

export default MainPage;
