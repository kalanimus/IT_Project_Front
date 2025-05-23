import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from "./surveyTeacher.module.css";

const mockSurveys = [
    {
        id: 1,
        title: 'Обратная связь по курсу “Высшая математика”',
        faculty: 'СГН3',
        course: '1',
        semester: 'Весенний семестр 2025',
        analytics: {
            scores: [3.6, 3.9, 4.1, 4.6, 4.0],
            comment: 'Курс довольно насыщенный и требует быстрого включения в работу...'
        }
    },
    {
        id: 2,
        title: 'Обратная связь по курсу “Высшая математика”',
        faculty: 'СГН3',
        course: '1',
        semester: 'Осенний семестр 2024',
        analytics: {
            scores: [3.5, 4.0, 4.2, 4.5, 4.1],
            comment: 'Полезный курс, особенно для тех, кто любит структурированную математику...'
        }
    },
    {
        id: 3,
        title: 'Обратная связь по курсу “Высшая математика”',
        faculty: 'СГН3',
        course: '2',
        semester: 'Осенний семестр 2024',
        analytics: {
            scores: [3.8, 4.1, 4.0, 4.3, 3.9],
            comment: 'Семестр прошёл интенсивно, было сложно, но полезно...'
        }
    }
];

const parameterLabels = [
    "Профессиональная полезность",
    "Структура материала",
    "Контакт с преподавателем",
    "Система оценивания",
    "Общая удовлетворенность"
];

const SurveyTeacher = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const newSurvey = location.state?.newSurvey;

    const [allSurveys, setAllSurveys] = useState(() =>
        newSurvey ? [newSurvey, ...mockSurveys] : [...mockSurveys]
    );

    const [selectedSurvey, setSelectedSurvey] = useState(
        newSurvey || mockSurveys[0]
    );

    const [filters, setFilters] = useState({
        time: 'all',
        title: 'all',
        faculty: 'all',
        course: 'all'
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const filteredSurveys = allSurveys.filter(survey => {
        const matchTitle = filters.title === 'all' || survey.title === filters.title;
        const matchFaculty = filters.faculty === 'all' || survey.faculty === filters.faculty;
        const matchCourse = filters.course === 'all' || survey.course === filters.course;
        return matchTitle && matchFaculty && matchCourse;
    });

    return (
        <div className={classes.page}>
            <Header />
            <div className={classes.content}>
                {/* Левая колонка */}
                <div className={classes.leftBlock}>
                    <h2 className={classes.heading}>Список всех опросов</h2>

                    <div className={classes.filters}>
                        <select onChange={(e) => handleFilterChange('time', e.target.value)}>
                            <option value="all">Все время</option>
                        </select>
                        <select onChange={(e) => handleFilterChange('title', e.target.value)}>
                            <option value="all">Все опросы</option>
                            {[...new Set(allSurveys.map(s => s.title))].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <select onChange={(e) => handleFilterChange('faculty', e.target.value)}>
                            <option value="all">Факультет</option>
                            {[...new Set(allSurveys.map(s => s.faculty))].map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                        <select onChange={(e) => handleFilterChange('course', e.target.value)}>
                            <option value="all">Курс</option>
                            {[...new Set(allSurveys.map(s => s.course))].map(c => (
                                <option key={c} value={c}>{c} курс</option>
                            ))}
                        </select>
                    </div>

                    <div className={classes.surveyList}>
                        {filteredSurveys.map(survey => (
                            <div key={survey.id} className={classes.surveyItem}>
                                <div className={classes.surveyText}>
                                    <div className={classes.surveyTitle}>{survey.title}</div>
                                    <div className={classes.surveyMeta}>
                                        {survey.faculty} {survey.course} курс — {survey.semester}
                                    </div>
                                </div>
                                <button
                                    className={classes.viewButton}
                                    onClick={() => setSelectedSurvey(survey)}
                                >
                                    Просмотреть аналитику
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        className={classes.createButton}
                        onClick={() => navigate('/CreateSurveyPage')}
                    >
                        + Создать кастомный опрос
                    </button>
                </div>

                {/* Правая колонка */}
                <div className={classes.rightBlock}>
                    <h2 className={classes.heading}>Аналитика</h2>
                    <div className={classes.analyticsBox}>
                        <div className={classes.analyticsTitle}>Средние показатели по параметрам</div>
                        <ul className={classes.analyticsList}>
                            {parameterLabels.map((label, i) => {
                                const value = selectedSurvey.analytics.scores[i];
                                let scoreClass = classes.scoreYellow;

                                if (value < 3.0) {
                                    scoreClass = classes.scoreRed;
                                } else if (value >= 4.0) {
                                    scoreClass = classes.scoreGreen;
                                }

                                return (
                                    <li key={i} className={classes.analyticsItem}>
                                        <span>{i + 1}. {label}</span>
                                        <span className={scoreClass}>
                                            {value.toFixed(1)}/5
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className={classes.commentBlock}>
                            <div className={classes.commentTitle}>Общий комментарий</div>
                            <div className={classes.commentText}>
                                {selectedSurvey.analytics.comment}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SurveyTeacher;
