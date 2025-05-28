import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/header.jsx";
import Footer from "../../components/Footer/footer.jsx";
import classes from "./teacherPage.module.css";
import {
  dislikeReview,
  fetchTeacherReviews,
  likeReview,
  sendTeacherReview,
} from "../../api.ts";
import coinIcon from "../../assets/icons/coin.png";
import likeIcon from "../../assets/icons/like.svg";
import starIcon from "../../assets/icons/star.svg";
import { useUser } from "../../context/UserContext.jsx";

const PAGE_SIZE = 10;

const TeacherPage = () => {
  const { user, isLoading, refreshUser } = useUser();
  const [searchParams] = useSearchParams();
  const fullname = searchParams.get("fullname") || "";
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newText, setNewText] = useState("");
  const [votes, setVotes] = useState({}); // { [reviewId]: 'like' | 'dislike' | null }
  const [teacherInfo, setTeacherInfo] = useState({}); // для отображения ФИО и рейтинга
  const [reviewRating, setReviewRating] = useState(0); // выбранная оценка
  const [hoverRating, setHoverRating] = useState(0); // оценка при наведении
  const [isAnonymous, setIsAnonymous] = useState(true); // чекбокс анонимности

  // Сброс отзывов при смене преподавателя
  useEffect(() => {
    setReviews([]);
    setPage(1);
  }, [fullname]);

  // Загрузка отзывов
  useEffect(() => {
    if (isLoading) return; // Ждём, пока подтянется пользователь/токен
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchTeacherReviews({
          fullname,
          page,
          pageSize: PAGE_SIZE,
        });
        if (ignore) return;
        setReviews((prev) =>
          page === 1 ? data.reviews : [...prev, ...data.reviews]
        );
        setTotal(data.total);

        // teacherInfo только из первого отзыва (если есть)
        if (page === 1 && data.reviews.length) {
          setTeacherInfo({
            fullName: data.reviews[0].teacherFullName,
            rating: data.rating,
          });
        }
        // Проставляем лайк/дизлайк для текущего пользователя
        if (user) {
          const newVotes = {};
          (page === 1 ? data.reviews : [...reviews, ...data.reviews]).forEach(
            (r) => {
              if (r.likedByUsernames?.includes(user.username)) {
                newVotes[r.id] = "like";
              } else if (r.dislikedByUsernames?.includes(user.username)) {
                newVotes[r.id] = "dislike";
              } else {
                newVotes[r.id] = null;
              }
            }
          );
          setVotes(newVotes);
        }
      } catch (e) {
        console.error("Ошибка при загрузке отзывов:", e);
      }
      setLoading(false);
    };
    if (fullname) load();
    return () => {
      ignore = true;
    };
  }, [fullname, page, isLoading, user]);

  // Лайк/дизлайк
  const handleVote = async (reviewId, type) => {
    // Если уже стоит лайк/дизлайк — ничего не делаем
    if (votes[reviewId] === type) return;

    try {
      if (type === "like") {
        await likeReview(reviewId);
        setVotes((prev) => ({
          ...prev,
          [reviewId]: "like",
        }));
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  likedByUsernames: r.likedByUsernames
                    ? [...r.likedByUsernames, user.username]
                    : [user.username],
                  dislikedByUsernames: r.dislikedByUsernames
                    ? r.dislikedByUsernames.filter((u) => u !== user.username)
                    : [],
                }
              : r
          )
        );
        // Убираем дизлайк на фронте
        // (votes всегда только одно значение, так что просто перезаписываем)
      } else if (type === "dislike") {
        await dislikeReview(reviewId);
        setVotes((prev) => ({
          ...prev,
          [reviewId]: "dislike",
        }));
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  dislikedByUsernames: r.dislikedByUsernames
                    ? [...r.dislikedByUsernames, user.username]
                    : [user.username],
                  likedByUsernames: r.likedByUsernames
                    ? r.likedByUsernames.filter((u) => u !== user.username)
                    : [],
                }
              : r
          )
        );
      }
      // После лайка/дизлайка обновляем отзывы, чтобы обновить счетчики
      // (можно обновлять только один отзыв, но проще обновить всю страницу)
      // setPage(1);
    } catch (e) {
      console.error("Ошибка при голосовании:", e);
    }
  };

  const hasMore = reviews.length < total;

  // Отправка отзыва
  const submitReview = async () => {
    if (!newText.trim() || reviewRating === 0) return;

    const review = {
      teacherFullName: teacherInfo.fullName || fullname,
      authorFullName: user.fullName,
      rating: reviewRating,
      text: newText,
      createdAt: new Date().toISOString(),
      isAnonymous: isAnonymous,
    };

    try {
      await sendTeacherReview(review);
      setNewText("");
      setReviewRating(0);
      setPage(1); // чтобы обновить отзывы
      if (typeof refreshUser === "function") {
        await refreshUser(); // обновить баланс пользователя
      }
    } catch (e) {
      console.log("Ошибка при отправке отзыва", e);
    }
  };

  return (
    <div className={classes.page}>
      <Header />

      <main className={classes.main}>
        {/* Шапка преподавателя */}
        <div className={classes.headerCard}>
          <img
            src={"/avatars/studentAvatarMock.png"}
            alt="Аватар преподавателя"
            className={classes.avatarPlaceholder}
          />
          <div className={classes.info}>
            <div className={classes.name}>
              {teacherInfo.fullName || fullname}
            </div>
          </div>
          <div className={classes.rating}>
            <img src={starIcon} alt="рейтинг" className={classes.starIcon} />
            {teacherInfo.rating ? teacherInfo.rating.toFixed(2) : "-"}
          </div>
        </div>

        {/* Форма нового отзыва */}
        <div className={classes.newReviewForm}>
          <div className={classes.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <img
                key={star}
                src={starIcon}
                alt={`${star} звезда`}
                className={
                  (hoverRating || reviewRating) >= star
                    ? classes.starFilled
                    : classes.starEmpty
                }
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setReviewRating(star)}
                style={{ cursor: "pointer" }}
              />
            ))}
            <span className={classes.starsLabel}>
              {reviewRating > 0 ? reviewRating : ""}
            </span>
          </div>
          <div className={classes.checkboxRow}>
            <label className={classes.checkboxLabel}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className={classes.checkboxInput}
              />
              Оставить отзыв анонимно
            </label>
          </div>
          <textarea
            className={classes.textarea}
            placeholder="Оставь свой отзыв!"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button
            onClick={submitReview}
            className={classes.submitBtn}
            disabled={reviewRating === 0}
          >
            Оставить отзыв за 10
            <img src={coinIcon} alt="монетка" className={classes.coinIcon} />
          </button>
        </div>

        {/* Список отзывов */}
        <div className={classes.reviewsList}>
          {reviews.map((r) => (
            <div key={r.id} className={classes.reviewItem}>
              <img
                src={"/avatars/studentAvatarMock.png"}
                alt="Аватар пользователя"
                className={classes.userAvatar}
              />
              <div className={classes.reviewContent}>
                <div className={classes.reviewHeader}>
                  <span className={classes.reviewAuthor}>
                    {r.isAnonymous ? "Аноним" : r.authorFullName}
                  </span>
                  <span className={classes.reviewDate}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={classes.reviewStarsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <img
                      key={star}
                      src={starIcon}
                      alt=""
                      className={
                        r.rating >= star
                          ? classes.starFilledSmall
                          : classes.starEmptySmall
                      }
                    />
                  ))}
                  <span className={classes.reviewRatingValue}>
                    {r.rating > 0 ? r.rating : ""}
                  </span>
                </div>
                <div className={classes.reviewText}>{r.text}</div>
                <div className={classes.reviewActions}>
                  {/* Лайк */}
                  <span
                    className={`${classes.reviewIcon} ${
                      votes[r.id] === "like" ? classes.activeLike : ""
                    }`}
                    onClick={() => handleVote(r.id, "like")}
                    style={{
                      pointerEvents: votes[r.id] === "like" ? "none" : "auto",
                    }}
                  >
                    <img
                      src={likeIcon}
                      alt="лайк"
                      className={classes.likeSvg}
                    />
                    {r.likedByUsernames?.length || 0}
                  </span>
                  {/* Дизлайк */}
                  <span
                    className={`${classes.reviewIcon} ${classes.dislike} ${
                      votes[r.id] === "dislike" ? classes.activeDislike : ""
                    }`}
                    onClick={() => handleVote(r.id, "dislike")}
                    style={{
                      pointerEvents:
                        votes[r.id] === "dislike" ? "none" : "auto",
                    }}
                  >
                    <img
                      src={likeIcon}
                      alt="дизлайк"
                      className={classes.likeSvg}
                    />
                    {r.dislikedByUsernames?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className={classes.loadMoreBtn}
              disabled={loading}
            >
              {loading
                ? "Загрузка..."
                : `Показать ещё (${total - reviews.length})`}
            </button>
          )}
          {!loading && reviews.length === 0 && (
            <div className={classes.noReviews}>Нет отзывов</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherPage;
