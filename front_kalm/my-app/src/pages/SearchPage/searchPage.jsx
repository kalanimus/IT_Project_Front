import React, { useState, useMemo } from 'react';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from './searchPage.module.css';
import { Link } from 'react-router-dom';

// МОКИ — в реальном приложении вы получаете этот список через API
const mockTeachers = [
  { id:1, name:'Авдеева Зинаида Константиновна', faculty:'СПНЭ "Инф. аналитика и полит. технологии"', avatar:'/avatars/avatar1.png', rating:'4,51' },
  { id:1, name:'Авдеева Зинаида Константиновна', faculty:'СПНЭ "Инф. аналитика и полит. технологии"', avatar:'/avatars/avatar1.png', rating:'4,51' },
  { id:8, name:'Карась Роман Андреевич',      faculty:'СПНЭ "Инф. аналитика и полит. технологии"', avatar:'/avatars/avatar8.png', rating:'4,51' },
  { id:1, name:'Авдеева Зинаида Константиновна', faculty:'СПНЭ "Инф. аналитика и полит. технологии"', avatar:'/avatars/avatar1.png', rating:'4,51' },
  { id:1, name:'Авдеева Зинаида Константиновна', faculty:'СПНЭ "Инф. аналитика и полит. технологии"', avatar:'/avatars/avatar1.png', rating:'4,51' },
  { id:1, name:'Авдеева Зинаида Константиновна', faculty:'СПНЭ "Инф. аналитика и полит. технологии"', avatar:'/avatars/avatar1.png', rating:'4,51' },
  { id:1, name:'Авдеева Зинаида Константиновна', faculty:'СПНЭ "Инф. аналитика и полит. технологии"', avatar:'/avatars/avatar1.png', rating:'4,51' },
];

const SearchPage = () => {
  const [query, setQuery]           = useState('');
  const [sortOrder, setSortOrder]   = useState('asc'); // 'asc' или 'desc'
  const [selectedFaculty, setFaculty] = useState('');
  const [minRating, setMinRating]   = useState(1);
  const [maxRating, setMaxRating]   = useState(5);

  // Собираем динамический список кафедр из данных
  const faculties = useMemo(() => {
    return Array.from(new Set(mockTeachers.map(t => t.faculty)));
  }, []);

  // Основной фильтр + сортировка
  const filtered = useMemo(() => {
    return mockTeachers
      // поиск по имени
      .filter(t => t.name.toLowerCase().includes(query.trim().toLowerCase()))
      // фильтр по кафедре
      .filter(t => !selectedFaculty || t.faculty === selectedFaculty)
      // фильтр по рейтингу
      .filter(t => {
        const num = parseFloat(t.rating.replace(',', '.'));
        return num >= minRating && num <= maxRating;
      })
      // сортировка по имени
      .sort((a, b) => {
        if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [query, selectedFaculty, minRating, maxRating, sortOrder]);

  const toggleSort = () =>
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  return (
    <div className={classes.page}>
      <Header />

      <main className={classes.main}>
        <h1 className={classes.title}>Преподаватели</h1>

        <div className={classes.searchWrapper}>
          <input
            type="text"
            className={classes.searchInput}
            placeholder="Введите имя преподавателя"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className={classes.controls}>
          {/* Сортировка */}
          <button onClick={toggleSort} className={classes.controlBtn}>
            Сортировать {sortOrder === 'asc' ? 'A → Я' : 'Я → A'}
          </button>

          {/* Фильтр по оценкам */}
          <div className={classes.ratingFilter}>
            <label>Оценка:</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.01"
              value={minRating}
              onChange={e =>
                setMinRating(Math.max(1, Math.min(5, parseFloat(e.target.value) || 1)))
              }
            />
            —
            <input
              type="number"
              min="1"
              max="5"
              step="0.01"
              value={maxRating}
              onChange={e =>
                setMaxRating(Math.max(1, Math.min(5, parseFloat(e.target.value) || 5)))
              }
            />
          </div>

          {/* Фильтр по кафедре */}
          <select
            className={classes.controlBtn}
            value={selectedFaculty}
            onChange={e => setFaculty(e.target.value)}
          >
            <option value="">Все кафедры</option>
            {faculties.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <ul className={classes.list}>
          {filtered.map(t => (
            <li key={t.id} className={classes.item}>

              <img src={t.avatar} alt={t.name} className={classes.avatar} />
              <div className={classes.info}>
              <div className={classes.name}>
                <Link to={`/teacher/${t.id}`} className={classes.nameLink}>
                   {t.name}
                </Link>
               </div>
                <div className={classes.faculty}>{t.faculty}</div>
              </div>
              <div className={classes.rating}>★ {t.rating}</div>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
