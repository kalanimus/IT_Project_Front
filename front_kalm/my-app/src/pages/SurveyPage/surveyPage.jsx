import React, { useEffect, useState } from "react";
import Header from "../../components/Header/header.jsx";
import Footer from "../../components/Footer/footer.jsx";
import classes from "./surveyPage.module.css";
import { useUser } from "../../context/UserContext.jsx";
import { getSurveys, getSurveyAnalytics } from "../../api.ts";
import { useNavigate } from "react-router-dom";

const SurveysPage = () => {
  const { user, isLoading } = useUser();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    setLoading(true);
    const load = async () => {
      try {
        // Один и тот же эндпоинт для всех ролей
        const surveysData = await getSurveys();
        // Преобразуем данные для отображения (пример)
        const surveysArr = Array.isArray(surveysData.surveys)
          ? surveysData.surveys
          : [];
        setSurveys(
          surveysArr.map((s) => ({
            ...s,
            desc: `${s.group} — ${s.subject} (${s.author})`,
            status:
              user.roleName === "Студент"
                ? s.isCompleted
                  ? "view"
                  : "available"
                : undefined,
          }))
        );
      } catch (e) {
        setSurveys([]);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className={classes.page}>
        <Header />
        <main className={classes.main}>
          <div className={classes.loading}>Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={classes.page}>
      <Header />
      <main className={classes.main}>
        {user.roleName === "Преподаватель" ? (
          <TeacherSurveys surveys={surveys} />
        ) : (
          <StudentSurveys surveys={surveys} />
        )}
      </main>
      <Footer />
    </div>
  );
};

function TeacherSurveys({ surveys }) {
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  const navigate = useNavigate();

  const handleShowAnalytics = async (survey) => {
    setSelectedSurvey(survey);
    setAnalytics(null);
    setAnalyticsError("");
    setAnalyticsLoading(true);
    try {
      const data = await getSurveyAnalytics({
        id: survey.id,
        group: survey.group,
        subject: survey.subject,
      });
      setAnalytics(data);
    } catch (e) {
      setAnalyticsError("Ошибка загрузки аналитики");
    }
    setAnalyticsLoading(false);
  };

  const handleCreateSurvey = () => {
    navigate("/create-survey");
  };
  return (
    <div className={classes.teacherContainer}>
      <div className={classes.surveysBlock}>
        <h1 className={classes.title}>Список всех опросов</h1>
        <div className={classes.filters}>
          <button className={classes.filterBtn}>Все фильтры</button>
          <button className={classes.filterBtn}>Все время</button>
          <button className={classes.filterBtn}>Все опросы</button>
          <button className={classes.filterBtn}>Факультет</button>
          <button className={classes.filterBtn}>Курс</button>
        </div>
        <ul className={classes.surveyList}>
          {surveys.length === 0 ? (
            <li className={classes.surveyEmpty}>Опросов пока нет</li>
          ) : (
            surveys.map((s) => (
              <li key={s.id} className={classes.surveyItem}>
                <div>
                  <div className={classes.surveyTitle}>{s.title}</div>
                  <div className={classes.surveyDesc}>{s.desc}</div>
                </div>
                <button
                  className={classes.analyticBtn}
                  onClick={() => handleShowAnalytics(s)}
                >
                  Посмотреть аналитику
                </button>
              </li>
            ))
          )}
        </ul>
        <button className={classes.createBtn} onClick = {handleCreateSurvey}>+ Создать кастомный опрос</button>
      </div>
      <div className={classes.analyticBlock}>
        {!selectedSurvey && (
          <div className={classes.analyticPlaceholder}>
            Выберите опрос для просмотра аналитики
          </div>
        )}
        {selectedSurvey && analyticsLoading && (
          <div className={classes.analyticPlaceholder}>
            Загрузка аналитики...
          </div>
        )}
        {selectedSurvey && analyticsError && (
          <div className={classes.analyticPlaceholder}>{analyticsError}</div>
        )}
        {selectedSurvey && analytics && (
          <div className={classes.analyticContent}>
            <div className={classes.analyticParams}>
              <div className={classes.analyticSubtitle}>
                Средние показатели по параметрам
              </div>
              <ol className={classes.analyticList}>
                {analytics.params
                  .filter(
                    (p) =>
                      !(
                        selectedSurvey.id === 1 &&
                        (p.questionType === "text" ||
                          p.questionType === "open" ||
                          p.questionType === "text_answer")
                      )
                  )
                  .map((p, idx) => (
                    <li key={idx}>
                      {p.question}{" "}
                      {selectedSurvey.id === 1 ? (
                        <span className={classes.analyticValue}>
                          {p.average !== undefined
                            ? Number(p.average).toFixed(1)
                            : "-"}
                          <span className={classes.analyticMax}>/5</span>
                        </span>
                      ) : p.questionType === "rating" ? (
                        <span className={classes.analyticValue}>
                          {p.average?.toFixed(1)}/5
                        </span>
                      ) : (
                        <span className={classes.analyticValue}>
                          {p.count} ответов
                        </span>
                      )}
                    </li>
                  ))}
              </ol>
            </div>
            {selectedSurvey.isStandart && analytics.generalComment && (
              <div className={classes.analyticCommentBlock}>
                <div className={classes.analyticCommentTitle}>
                  Общий комментарий
                </div>
                <div className={classes.analyticCommentText}>
                  {analytics.generalComment}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentSurveys({ surveys }) {
  const navigate = useNavigate();

  const handlePassSurvey = (survey) => {
    navigate("/PassSurveyPage", { state: { survey } });
  };

  return (
    <div className={classes.studentContainer}>
      <h1 className={classes.title}>Мои опросы</h1>
      <div className={classes.filters}>
        <button className={classes.filterBtn}>Все опросы</button>
        <button className={classes.filterBtn}>Все время</button>
      </div>
      <ul className={classes.surveyList}>
        {surveys.length === 0 ? (
          <li className={classes.surveyEmpty}>Опросов пока нет</li>
        ) : (
          surveys.map((s) => (
            <li key={s.id} className={classes.surveyItem}>
              <div>
                <div className={classes.surveyTitle}>{s.title}</div>
                <div className={classes.surveyDesc}>{s.desc}</div>
              </div>
              <div className={classes.surveyStatus}>
                {s.status === "available" ? (
                  <button
                    className={classes.passBtn}
                    onClick={() => handlePassSurvey(s)}
                  >
                    Пройти опрос
                  </button>
                ) : s.status === "view" ? (
                  <button className={classes.viewBtn}>Посмотреть ответы</button>
                ) : (
                  <span className={classes.disabledBtn}>Недоступен</span>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default SurveysPage;
