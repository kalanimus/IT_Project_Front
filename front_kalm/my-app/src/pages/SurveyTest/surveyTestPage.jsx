import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import { useSurveys } from './SurveysContext.jsx';
import classes from './surveyTestPage.module.css';


// Описание вопросов с типами
const questionsMeta = [
  { id: 1, text: 'Насколько курс был полезен для вашего профессионального развития?', type: 'rating' },
  { id: 2, text: 'Насколько материал курса был понятен, логично изложен и хорошо структурирован?', type: 'rating' },
  { id: 3, text: 'Насколько преподаватель эффективно взаимодействовал с аудиторией (в том числе вне занятий)?', type: 'rating' },
  { id: 4, text: 'Насколько формы контроля (тесты, задания, экзамены и др.) были объективными и понятными?', type: 'rating' },
  { id: 5, text: 'Насколько вы в целом удовлетворены содержанием и организацией курса?', type: 'rating' },
  // Добавляем новый текстовый вопрос
  { id: 6, text: 'Поделитесь своими впечатлениями о курсе и преподавателе…', type: 'text' },
];

// Заглушки для уже пройденных ответов
const mockViewAnswers = {
  1: { ratings: [5, 4, 5, 4, 5], comment: 'Очень понравилось, особенно практические занятия!' },
  2: { ratings: [3, 3, 4, 2, 3], comment: 'Материал мог быть структурированнее, но в целом нормально.' },
  // … для других surveyId по необходимости
};

export default function SurveyDetailPage() {
  const { surveyId } = useParams();
  const navigate    = useNavigate();
  const { surveys, setSurveys } = useSurveys();
  const survey      = surveys.find(s => s.id === +surveyId);

  // Редирект если опроса нет или он недоступен
  useEffect(() => {
    if (!survey || survey.status === 'disabled') {
      navigate('/surveys');
    }
  }, [survey, navigate]);

  // Для active режима: стейт инпутов
  const [ratings, setRatings] = useState(Array(5).fill(0));
  const [comment, setComment] = useState('');

  // При load, если view режим — загружаем mockViewAnswers
  useEffect(() => {
    if (survey?.status === 'view') {
      const ans = mockViewAnswers[survey.id] || { ratings: [], comment: '' };
      setRatings(ans.ratings);
      setComment(ans.comment);
    }
  }, [survey]);

  const handleStar = (qIdx, value) => {
    if (survey.status !== 'active') return;     // только в active можно менять
    setRatings(r => {
      const copy = [...r];
      copy[qIdx] = value;
      return copy;
    });
  };

  const handleSubmit = () => {
    // апдейтим статус в контексте
    setSurveys(prev =>
      prev.map(s =>
        s.id === +surveyId ? { ...s, status: 'view' } : s
      )
    );
    // в будущем тут POST на бэк с { ratings, comment }
    navigate('/surveys');
  };

  if (!survey) return null;

  return (
    <div className={classes.page}>
      <Header />
      <main className={classes.main}>
        <h1 className={classes.title}>{survey.title}</h1>

        {questionsMeta.map((q, idx) => (
          <div key={q.id} className={classes.question}>
            <div className={classes.questionText}>
              {q.id}. {q.text}
            </div>

            {q.type === 'rating' ? (
              <div className={classes.stars}>
                {[1,2,3,4,5].map(n => (
                  <span
                    key={n}
                    className={classes.star}
                    onClick={() => handleStar(idx, n)}
                  >
                    {n <= (ratings[idx] || 0) ? '★' : '☆'}
                  </span>
                ))}
              </div>
            ) : (
              // текстовый вопрос
              <textarea
                className={classes.textarea}
                readOnly={survey.status !== 'active'}
                placeholder="Оставь свой отзыв!"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            )}
          </div>
        ))}

        {survey.status === 'active' && (
          <button className={classes.submitBtn} onClick={handleSubmit}>
            Отправить ответы
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
}