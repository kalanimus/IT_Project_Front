import React, { useState } from "react";
import Header from "../../components/Header/header.jsx";
import Footer from "../../components/Footer/footer.jsx";
import classes from "./passSurveyPage.module.css";
import starIcon from "../../assets/icons/star.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { completeSurvey } from "../../api.ts";

const PassSurveyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const survey = location.state?.survey;

  // Получаем части и вопросы
  const parts = survey?.questionsJson || [];

  // Состояния для ответов
  const [answers, setAnswers] = useState({});
  const [hoverStars, setHoverStars] = useState({});

  const handleRadio = (partIdx, qIdx, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`${partIdx}_${qIdx}`]: value,
    }));
  };

  const handleCheckbox = (partIdx, qIdx, value) => {
    const key = `${partIdx}_${qIdx}`;
    setAnswers((prev) => {
      const prevArr = Array.isArray(prev[key]) ? prev[key] : [];
      return {
        ...prev,
        [key]: prevArr.includes(value)
          ? prevArr.filter((v) => v !== value)
          : [...prevArr, value],
      };
    });
  };

  const handleText = (partIdx, qIdx, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`${partIdx}_${qIdx}`]: value,
    }));
  };

  const handleStar = (partIdx, qIdx, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`${partIdx}_${qIdx}`]: value,
    }));
  };

  const handleStarHover = (partIdx, qIdx, value) => {
    setHoverStars((prev) => ({
      ...prev,
      [`${partIdx}_${qIdx}`]: value,
    }));
  };

  const handleStarLeave = (partIdx, qIdx) => {
    setHoverStars((prev) => ({
      ...prev,
      [`${partIdx}_${qIdx}`]: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Собираем ответы в нужный формат
    const answersArr = [];
    parts.forEach((part, partIdx) => {
      part.questions.forEach((q, qIdx) => {
        const key = `${partIdx}_${qIdx}`;
        let answerValue = answers[key];
        if (Array.isArray(answerValue)) {
          answerValue = answerValue.join(", ");
        }
        answersArr.push({
          question: q.text,
          questionType: q.type,
          answer: answerValue !== undefined ? String(answerValue) : "",
        });
      });
    });

    const payload = {
      surveyId: survey.id,
      targetTeacher: survey.author,
      group: survey.group,
      subject: survey.subject,
      answers: answersArr,
    };

    try {
      await completeSurvey(survey.id, payload);
      
      // console.log("Отправка ответов:", payload);
      alert("Ответы успешно отправлены!");
      navigate("/survey");
      // Можно сделать редирект или очистку формы
    } catch (e) {
      alert("Ошибка при отправке ответов");
    }
  };

  return (
    <div className={classes.page}>
      <Header />
      <main className={classes.main}>
        <h1 className={classes.title}>{survey?.title || "Опрос"}</h1>
        <form className={classes.form} onSubmit={handleSubmit}>
          {parts.map((part, partIdx) => (
            <div className={classes.partBlock} key={partIdx}>
              <div className={classes.partTitle}>{part.title}</div>
              {part.questions.map((q, qIdx) => (
                <div className={classes.questionBlock} key={qIdx}>
                  <label className={classes.question}>{q.text}</label>
                  {q.type === "rating" && (
                    <div className={classes.starsRow}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const key = `${partIdx}_${qIdx}`;
                        const isHover = hoverStars[key] !== undefined;
                        const isActive =
                          (isHover && star <= hoverStars[key]) ||
                          (!isHover && star <= (answers[key] || 0));
                        return (
                          <img
                            key={star}
                            src={starIcon}
                            alt={`${star} звезда`}
                            className={
                              isActive
                                ? `${classes.starFilled} ${
                                    isHover ? classes.starHover : ""
                                  }`
                                : classes.starEmpty
                            }
                            onClick={() => handleStar(partIdx, qIdx, star)}
                            onMouseEnter={() =>
                              handleStarHover(partIdx, qIdx, star)
                            }
                            onMouseLeave={() => handleStarLeave(partIdx, qIdx)}
                          />
                        );
                      })}
                    </div>
                  )}
                  {/* {q.type === "single" && (
                    <div className={classes.optionsRow}>
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className={classes.optionLabel}>
                          <input
                            type="radio"
                            name={`single_${partIdx}_${qIdx}`}
                            value={opt}
                            checked={answers[`${partIdx}_${qIdx}`] === opt}
                            onChange={() => handleRadio(partIdx, qIdx, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )} */}
                  {q.type === "multiple_choice" && (
                    <div className={classes.optionsRow}>
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className={classes.optionLabel}>
                          <input
                            type="checkbox"
                            value={opt}
                            checked={
                              Array.isArray(answers[`${partIdx}_${qIdx}`]) &&
                              answers[`${partIdx}_${qIdx}`].includes(opt)
                            }
                            onChange={() => handleCheckbox(partIdx, qIdx, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === "text" && (
                    <textarea
                      className={classes.textarea}
                      placeholder="Ваш ответ"
                      value={answers[`${partIdx}_${qIdx}`] || ""}
                      onChange={(e) =>
                        handleText(partIdx, qIdx, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className={classes.btnRow}>
            <button className={classes.submitBtn} type="submit">
              Оставить отзыв
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default PassSurveyPage;
