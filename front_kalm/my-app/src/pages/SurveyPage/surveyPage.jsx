import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from "./surveyPage.module.css";

const mockSurveys = [
    {
        id: 1,
        title: "Обратная связь по курсу “Интернет технологии”",
        teacher: "Назаренко Н. В.",
        semester: "Весенний семестр 2025",
        status: "active"
    },
    {
        id: 2,
        title: "Обратная связь по курсу “Программная инженерия”",
        teacher: "Никулишина Т. А.",
        semester: "Весенний семестр 2025",
        status: "active"
    },
    {
        id: 3,
        title: "Обратная связь по курсу “Политический анализ”",
        teacher: "Бочарников И. В.",
        semester: "Осенний семестр 2024",
        status: "view"
    },
    {
        id: 4,
        title: "Обратная связь по курсу “Социальные системы и процессы”",
        teacher: "Галаганова С. Г.",
        semester: "Осенний семестр 2024",
        status: "disabled"
    },
    {
        id: 5,
        title: "Обратная связь по курсу “Социология семьи и брака”",
        teacher: "Зубова С. В.",
        semester: "Весенний семестр 2025",
        status: "active"
    },
    {
        id: 6,
        title: "Обратная связь по курсу “История социологии”",
        teacher: "Шайтанов М. М.",
        semester: "Осенний семестр 2024",
        status: "view"
    },
    {
        id: 7,
        title: "Обратная связь по курсу “Методы сбора данных”",
        teacher: "Овсянников А. Д.",
        semester: "Весенний семестр 2025",
        status: "disabled"
    },
    {
        id: 8,
        title: "Обратная связь по курсу “Качественные методы”",
        teacher: "Коган Л. М.",
        semester: "Осенний семестр 2024",
        status: "view"
    },
    {
        id: 9,
        title: "Обратная связь по курсу “Качественные методы”",
        teacher: "Коган Л. М.",
        semester: "Осенний семестр 2024",
        status: "view"
    },
];

const SurveyPage = () => {
    const [survey] = useState(mockSurveys);
    const [statusFilter, setStatusFilter] = useState("all");
    const [semesterFilter, setSemesterFilter] = useState("all");
    const [visibleCount, setVisibleCount] = useState(10);

    const containerRef = useRef(null);
    const sentinelRef = useRef(null);
    const observer = useRef(null);

    const uniqueSemesters = [...new Set(survey.map(s => s.semester))];

    const filteredSurveys = survey.filter(item => {
        const matchStatus = statusFilter === "all" || item.status === statusFilter;
        const matchSemester = semesterFilter === "all" || item.semester === semesterFilter;
        return matchStatus && matchSemester;
    });

    const displayedSurveys = filteredSurveys.slice(0, visibleCount);

    const observeSentinel = useCallback(() => {
        if (!sentinelRef.current || !containerRef.current) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + 10, filteredSurveys.length));
                }
            },
            {
                root: containerRef.current,
                threshold: 1.0,
            }
        );

        observer.current.observe(sentinelRef.current);
    }, [filteredSurveys.length]);

    useEffect(() => {
        observeSentinel();
    }, [observeSentinel, displayedSurveys.length]);

    return (
        <div className={classes.page}>
            <Header />
            <div className={classes.all_block}>
                <div className={classes.text1}>Мои Опросы</div>

                <div className={classes.filters}>
                    <select
                        onChange={(e) => {
                            setVisibleCount(10);
                            setStatusFilter(e.target.value);
                        }}
                        value={statusFilter}
                    >
                        <option value="all">Все опросы</option>
                        <option value="active">Доступные</option>
                        <option value="view">Просмотр</option>
                        <option value="disabled">Недоступные</option>
                    </select>

                    <select
                        onChange={(e) => {
                            setVisibleCount(10);
                            setSemesterFilter(e.target.value);
                        }}
                        value={semesterFilter}
                    >
                        <option value="all">Все время</option>
                        {uniqueSemesters.map((sem, idx) => (
                            <option key={idx} value={sem}>{sem}</option>
                        ))}
                    </select>
                </div>

                <div className={classes.middle_form} ref={containerRef}>
                    {displayedSurveys.map((item) => (
                        <div key={item.id} className={classes.card}>
                            <div className={`${classes.statusDot} ${classes[item.status]}`} />
                            <div className={classes.info}>
                                <div className={classes.title}>{item.title}</div>
                                <div className={classes.meta}>{item.teacher} — {item.semester}</div>
                            </div>
                            <div className={classes.action}>
                                {item.status === "active" && <button>Пройти опрос</button>}
                                {item.status === "view" && <button>Посмотреть ответы</button>}
                                {item.status === "disabled" && (
                                    <button className={classes.disabledBtn} disabled>Недоступен</button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={sentinelRef} style={{ height: '1px', visibility: 'hidden' }} />
                    {filteredSurveys.length === 0 && (
                        <p className={classes.not_found}>У вас нет опросов!</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SurveyPage;
