import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from './mainAuthPage.module.css';
import { getLatestTeacherReview, getMostActiveStudent, getTopRatedTeachers } from '../../api.ts';
import { useUser } from '../../context/UserContext.jsx';

// ——— Моки данных ———
const mockNews = [
  {
    id: 1,
    title: 'Обновлено расписание',
    date: '2025-05-25',
    text: 'Расписание занятий на осенний семестр уже доступно в Личном кабинете.',
  },
  {
    id: 2,
    title: 'Новый опрос по качеству лекций',
    date: '2025-05-20',
    text: 'Примите участие в опросе: расскажите, что вам нравится в формате онлайн-лекций.',
  },
  {
    id: 3,
    title: 'Технические работы',
    date: '2025-05-18',
    text: '19 мая с 02:00 до 05:00 по МСК возможны кратковременные перебои в работе платформы.',
  },
];

const mockFAQ = [
  { id: 1, question: 'Как пройти опрос?', answer: '' },
  { id: 2, question: 'Точно ли все данные будут анонимными?', answer: 'Да! Никто не будет знать о ваших действиях, пока вы сами этого не захотите!' },
  { id: 3, question: 'Еще один тупой вопрос, который я пока не придумала?', answer: '' },
  { id: 4, question: 'И еще один тупой вопрос, который я пока не придумала?', answer: '' },
];

export default function MainAuthPage() {
  const { user, isLoading } = useUser();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const [activeStudent, setActiveStudent] = useState(null);
  const [topTeachers, setTopTeachers] = useState([]);
  const [lastReview, setLastReview] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    // Получить самого активного студента
    getMostActiveStudent()
      .then(student => setActiveStudent(student))
      .catch(() => setActiveStudent(null));

    // Получить топ-3 преподавателей
    getTopRatedTeachers()
      .then(teachers => setTopTeachers(teachers))
      .catch(() => setTopTeachers([]));

    // Получить последний отзыв
    getLatestTeacherReview()
      .then(review => setLastReview(review))
      .catch(() => setLastReview(null));
  }, [isLoading]);

  const toggleFAQ = id => {
    setExpandedFAQ(prev => (prev === id ? null : id));
  };

  return (
    <div className={classes.page}>
      <Header />

      <main className={classes.main}>
        <div className={classes.content}>
          {/* —— ЛЕВАЯ КОЛОНКА —— */}
          <div className={classes.left}>
            {/* Новости */}
            <section className={classes.news}>
              <h2>Новости</h2>
              {mockNews.length === 0 ? (
                <div className={classes.newsEmpty}>
                  Новостей пока нет, но скоро тут что-нибудь обязательно появится!
                </div>
              ) : (
                <ul className={classes.newsList}>
                  {mockNews.map(n => (
                    <li key={n.id} className={classes.newsItem}>
                      <div className={classes.newsHeader}>
                        <span className={classes.newsTitle}>{n.title}</span>
                        <span className={classes.newsDate}>{n.date}</span>
                      </div>
                      <p className={classes.newsText}>{n.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* FAQ */}
            <section className={classes.faq}>
              <h2>Отвечаем на вопросы:</h2>
              <ul className={classes.faqList}>
                {mockFAQ.map(q => (
                  <li key={q.id} className={classes.faqItem}>
                    <div
                      className={classes.faqQuestion}
                      onClick={() => toggleFAQ(q.id)}
                    >
                      {q.question}
                      <span className={classes.faqIcon}>
                        {expandedFAQ === q.id ? '−' : '+'}
                      </span>
                    </div>
                    {expandedFAQ === q.id && (
                      <div className={classes.faqAnswer}>{q.answer}</div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* —— ПРАВАЯ КОЛОНКА —— */}
          <div className={classes.right}>
            {/* Самый активный студент */}
            <section className={classes.activeStudent}>
              <h3>Самый активный студент</h3>
              {activeStudent ? (
                <div className={classes.studentCard}>
                  <img
                    src="/avatars/StudentAvatarMock.png"
                    alt={activeStudent.fullName}
                    className={classes.avatarSmall}
                  />
                  <div>
                    <div className={classes.name}>{activeStudent.fullName}</div>
                    <div className={classes.faculty}>{activeStudent.roleName}</div>
                  </div>
                </div>
              ) : (
                <div>Нет данных</div>
              )}
            </section>

            {/* Топ преподавателей */}
            <section className={classes.topTeachers}>
              <h3>Топ преподавателей по факультету</h3>
              <ul className={classes.teacherList}>
                {topTeachers.length > 0 ? (
                  topTeachers.map((t, idx) => (
                    <li key={idx}>
                      <div className={classes.teacherCard}>
                        <img
                          src="/avatars/StudentAvatarMock.png"
                          alt={t.fullName}
                          className={classes.avatarSmall}
                        />
                        <div>
                          <div className={classes.name}>{t.fullName}</div>
                          <div className={classes.faculty}>Рейтинг: {t.rating}</div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>Нет данных</li>
                )}
              </ul>
            </section>

            {/* Последние отзывы */}
            <section className={classes.lastReviews}>
              <h3>Последние отзывы</h3>
              {lastReview ? (
                <div className={classes.reviewCard}>
                  <img
                    src="/avatars/StudentAvatarMock.png"
                    alt={lastReview.teacherFullName}
                    className={classes.avatarSmall}
                  />
                  <div>
                    <div className={classes.name}>{lastReview.teacherFullName}</div>
                    <div className={classes.faculty}>
                      Оценка: {lastReview.rating}
                    </div>
                    <div className={classes.faculty}>
                      Автор: {lastReview.isAnonymous ? 'Анонимно' : lastReview.authorFullName}
                    </div>
                    <p className={classes.reviewText}>{lastReview.text}</p>
                  </div>
                </div>
              ) : (
                <div>Нет отзывов</div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
