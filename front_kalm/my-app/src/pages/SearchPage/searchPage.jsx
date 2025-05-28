import React, { useState, useEffect } from "react";
import Header from "../../components/Header/header.jsx";
import Footer from "../../components/Footer/footer.jsx";
import classes from "./searchPage.module.css";
import { Link } from "react-router-dom";
import { fetchTeachers, MyApi } from "../../api.ts";
import { useUser } from "../../context/UserContext.jsx";

const PAGE_SIZE = 10;

const SearchPage = () => {
  // const { loading: userLoading } = useUser?.() || { loading: false }; // если useUser есть
  const { isLoading } = useUser();

  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);

  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Сброс при изменении фильтров
  useEffect(() => {
    setTeachers([]);
    setPage(1);
  }, [query, minRating, maxRating, sortOrder]);

  // Загрузка данных только если авторизация инициализирована
  useEffect(() => {
    if (isLoading) return; // Ждём, пока подтянется пользователь/токен
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchTeachers({
          page,
          pageSize: PAGE_SIZE,
          search: query,
          minRating,
          maxRating,
          sortOrder,
        });
        if (ignore) return;
        setTeachers((prev) =>
          page === 1 ? data.teachers : [...prev, ...data.teachers]
        );
        setTotal(data.total);
      } catch (e) {
        console.error("Ошибка при загрузке преподавателей:", e);
      }
      setLoading(false);
    };
    load();
    return () => {
      ignore = true;
    };
  }, [page, query, minRating, maxRating, sortOrder, isLoading]);

  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const hasMore = teachers.length < total;

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
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={classes.controls}>
          <button onClick={toggleSort} className={classes.controlBtn}>
            Сортировать {sortOrder === "asc" ? "A → Я" : "Я → A"}
          </button>
          <button
            className={classes.controlBtn}
            style={{ opacity: 0.7, cursor: "default" }}
          >
            Все фильтры
          </button>
        </div>

        <ul className={classes.list}>
          {teachers.map((t, idx) => (
            <li key={t.id || t.fullName + idx} className={classes.item}>
              <img
                src={t.avatar || "/avatars/studentAvatarMock.png"}
                alt={t.fullName}
                className={classes.avatar}
              />
              <div className={classes.info}>
                <div className={classes.name}>
                  <Link
                    to={`/teacher-reviews?fullname=${encodeURIComponent(
                      t.fullName
                    )}`}
                    className={classes.nameLink}
                  >
                    {t.fullName}
                  </Link>
                </div>
              </div>
              <div className={classes.rating}>
                <span className={classes.star}>★</span>{" "}
                {t.rating?.toFixed ? t.rating.toFixed(2) : t.rating}
              </div>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div style={{ textAlign: "center", margin: "18px 0" }}>
            <button
              className={classes.controlBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Показать ещё"}
            </button>
          </div>
        )}
        {!loading && teachers.length === 0 && (
          <div style={{ textAlign: "center", color: "#888", margin: "24px 0" }}>
            Нет преподавателей по вашему запросу
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
