import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from './surveyPage.module.css';
import { useSurveys } from "../SurveyTest/SurveysContext.jsx";

const SurveyPage = () => {
  const { surveys } = useSurveys();
  const [statusFilter, setStatusFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);

  const containerRef = useRef();
  const sentinelRef = useRef();
  const observer = useRef();

  const uniqueSemesters = [...new Set(surveys.map(s => s.semester))];

  const filtered = surveys.filter(item => {
    const okStatus = statusFilter === 'all' || item.status === statusFilter;
    const okSem    = semesterFilter === 'all' || item.semester === semesterFilter;
    return okStatus && okSem;
  });

  const displayed = filtered.slice(0, visibleCount);

  const observe = useCallback(() => {
    if (!sentinelRef.current || !containerRef.current) return;
    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisibleCount(prev => Math.min(prev + 10, filtered.length));
        }
      },
      { root: containerRef.current, threshold: 1.0 }
    );
    observer.current.observe(sentinelRef.current);
  }, [filtered.length]);

  useEffect(() => { observe(); }, [observe, displayed.length]);

  return (
    <div className={classes.page}>
      <Header />

      <div className={classes.all_block}>
        <div className={classes.text1}>Мои Опросы</div>

        <div className={classes.filters}>
          <select
            value={statusFilter}
            onChange={e => { setVisibleCount(10); setStatusFilter(e.target.value); }}
          >
            <option value="all">Все опросы</option>
            <option value="active">Доступные</option>
            <option value="view">Просмотр</option>
            <option value="disabled">Недоступные</option>
          </select>

          <select
            value={semesterFilter}
            onChange={e => { setVisibleCount(10); setSemesterFilter(e.target.value); }}
          >
            <option value="all">Все время</option>
            {uniqueSemesters.map((sem, idx) => (
              <option key={idx} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        <div className={classes.middle_form} ref={containerRef}>
          {displayed.map(item => (
            <div key={item.id} className={classes.card}>
              <div className={`${classes.statusDot} ${classes[item.status]}`} />
              <div className={classes.info}>
                <div className={classes.title}>{item.title}</div>
                <div className={classes.meta}>{item.teacher} — {item.semester}</div>
              </div>
              <div className={classes.action}>
                {item.status === 'active' && (
                  <Link to={`/survey/${item.id}`}>
                    <button>Пройти опрос</button>
                  </Link>
                )}
                {item.status === 'view' && (
                  <Link to={`/survey/${item.id}`}>
                    <button>Посмотреть ответы</button>
                  </Link>
                )}
                {item.status === 'disabled' && (
                  <button className={classes.disabledBtn} disabled>Недоступен</button>
                )}
              </div>
            </div>
          ))}
          <div ref={sentinelRef} style={{ height: 1, visibility: 'hidden' }} />
          {filtered.length === 0 && (
            <p className={classes.not_found}>У вас нет опросов!</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SurveyPage;
