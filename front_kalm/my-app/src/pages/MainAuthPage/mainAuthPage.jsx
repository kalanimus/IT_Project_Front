import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from './mainAuthPage.module.css';

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
  { id: 2, question: 'Точно ли все данные будут анонимными?', answer: '' },
  { id: 3, question: 'Еще один тупой вопрос, который я пока не придумала?', answer: '' },
  { id: 4, question: 'И еще один тупой вопрос, который я пока не придумала?', answer: '' },
];

const activeStudent = {
  id: 1,
  name: 'Иванов Иван',
  faculty: 'СПНЭ "Информационная аналитика и политические технологии"',
  avatar: '/avatars/avatar-student1.png',
};

const topTeachers = [
  {
    id: 3,
    name: 'Бочарников Игорь Валентинович',
    faculty: 'СПНЭ "Информационная аналитика и политические технологии"',
    avatar: '/avatars/avatar3.png',
  },
  {
    id: 4,
    name: 'Галаганова Светлана Георгиевна',
    faculty: 'СПНЭ "Информационная аналитика и политические технологии"',
    avatar: '/avatars/avatar4.png',
  },
  {
    id: 5,
    name: 'Ламинина Ольга Глебовна',
    faculty: 'СПНЭ "Информационная аналитика и политические технологии"',
    avatar: '/avatars/avatar5.png',
  },
];

const lastReviews = [
  {
    id: 1,
    name: 'Урсул Виталий Игнатович',
    avatar: '/avatars/avatar-teacher4.png',
    text: 'Препод норм, добрый и эмоциональный!!!!!! Дайте ему премию “Препод года”! ',
  },
];

export default function MainAuthPage() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

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
              <div className={classes.studentCard}>
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className={classes.avatarSmall}
                />
                <div>
                  <div className={classes.name}>{activeStudent.name}</div>
                  <div className={classes.faculty}>{activeStudent.faculty}</div>
                </div>
              </div>
            </section>

            {/* Топ преподавателей */}
            <section className={classes.topTeachers}>
              <h3>Топ преподавателей по факультету</h3>
              <ul className={classes.teacherList}>
                {topTeachers.map(t => (
                  <li key={t.id}>
                    <Link to={`/teacher/${t.id}`} className={classes.teacherCard}>
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className={classes.avatarSmall}
                      />
                      <div>
                        <div className={classes.name}>{t.name}</div>
                        <div className={classes.faculty}>{t.faculty}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Последние отзывы */}
            <section className={classes.lastReviews}>
              <h3>Последние отзывы</h3>
              {lastReviews.map(r => (
                <div key={r.id} className={classes.reviewCard}>
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className={classes.avatarSmall}
                  />
                  <div>
                    <div className={classes.name}>{r.name}</div>
                    <p className={classes.reviewText}>{r.text}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
