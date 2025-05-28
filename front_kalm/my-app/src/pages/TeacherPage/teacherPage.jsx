import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from './teacherPage.module.css';

// Моки преподавателей
const mockTeachers = [
  {
    id: '8',
    name: 'Карась Роман Андреевич',
    faculty: 'СГН3 "Информационная аналитика и политические технологии"',
    avatar: '/avatars/avatar8.png',
    rating: '4,51',
  },
  // … другие
];

// Моки отзывов
const allReviews = [
  {
    id: 1,
    userName: 'Неопознанный Аксолотль',
    userAvatar: '/avatars/avatar-f1.png',
    text: 'Методика преподавания интересная!...',
  },
  {
    id: 2,
    userName: 'Неопознанный Аллигатор',
    userAvatar: '/avatars/avatar-f2.png',
    text: 'Методика преподавания интересная!...',
  },
  // … ещё
];

const TeacherPage = () => {
  const { teacherId } = useParams();
  const teacher = mockTeachers.find(t => t.id === teacherId) || mockTeachers[0];

  const [visibleCount, setVisibleCount] = useState(5);
  const [reviews, setReviews] = useState(allReviews.slice(0, visibleCount));
  const [newText, setNewText] = useState('');

  // { [reviewId]: 'like' | 'dislike' }
  const [votes, setVotes] = useState({});

  const loadMore = () => {
    const next = visibleCount + 5;
    setVisibleCount(next);
    setReviews(allReviews.slice(0, next));
  };

  const submitReview = () => {
    if (!newText.trim()) return;
    const newReview = {
      id: Date.now(),
      userName: 'Вы',
      userAvatar: '/avatars/you.png',
      text: newText.trim(),
    };
    setReviews([newReview, ...reviews]);
    setNewText('');
  };

  const handleVote = (reviewId, type) => {
    setVotes(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === type ? null : type
    }));
  };

  return (
    <div className={classes.page}>
      <Header />

      <main className={classes.main}>
        {/* Шапка профиля */}
        <div className={classes.headerCard}>
          <img src={teacher.avatar} alt={teacher.name} className={classes.avatar} />
          <div className={classes.info}>
            <div className={classes.name}>{teacher.name}</div>
            <div className={classes.faculty}>{teacher.faculty}</div>
          </div>
          <div className={classes.rating}>★ {teacher.rating}</div>
        </div>

        {/* Список отзывов */}
        <div className={classes.reviewsList}>
          {reviews.map(r => (
            <div key={r.id} className={classes.reviewItem}>
              <img
                src={r.userAvatar}
                alt={r.userName}
                className={classes.userAvatar}
              />
              <div className={classes.reviewContent}>
                <div className={classes.reviewText}>{r.text}</div>
                <div className={classes.reviewActions}>
                {/* Лайк */}
                <span
                    className={
                    `${classes.reviewIcon} ` +
                    (votes[r.id] === 'like' ? classes.activeLike : '')
                    }
                    onClick={() => handleVote(r.id, 'like')}
                >
                    👍
                </span>

                {/* Дизлайк */}
                <span
                    className={
                    `${classes.reviewIcon} ` +
                    (votes[r.id] === 'dislike' ? classes.activeDislike : '')
                    }
                    onClick={() => handleVote(r.id, 'dislike')}
                >
                    👎
                </span>
                </div>
              </div>
            </div>
          ))}

          {visibleCount < allReviews.length && (
            <button onClick={loadMore} className={classes.loadMoreBtn}>
              Показать ещё ({allReviews.length - visibleCount})
            </button>
          )}
        </div>

        {/* Форма нового отзыва */}
        <div className={classes.newReviewForm}>
          <textarea
            className={classes.textarea}
            placeholder="Оставь свой отзыв!"
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />
          <button onClick={submitReview} className={classes.submitBtn}>
            Оставить отзыв за 10 🪙
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherPage;