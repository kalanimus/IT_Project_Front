import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import classes from './createsurveyPage.module.css';

const CreateSurveyPage = () => {
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState("");
    const [facultyGroups, setFacultyGroups] = useState("");
    const [dateRange, setDateRange] = useState("");
    const [feedback, setFeedback] = useState("");

    const [questions, setQuestions] = useState([
        { text: "Пример-1", type: "scale", answerText: "" }
    ]);

    const [errors, setErrors] = useState({
        courseTitle: false,
        facultyGroups: false,
        dateRange: false
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleQuestionChange = (index, value) => {
        const updated = [...questions];
        updated[index].text = value;
        setQuestions(updated);
    };

    const handleTypeChange = (index, value) => {
        const updated = [...questions];
        updated[index].type = value;
        setQuestions(updated);
    };

    const handleAnswerTextChange = (index, value) => {
        const updated = [...questions];
        updated[index].answerText = value;
        setQuestions(updated);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { text: "", type: "scale", answerText: "" }]);
    };

    const handleSubmit = () => {
        const newErrors = {
            courseTitle: courseTitle.trim() === "",
            facultyGroups: facultyGroups.trim() === "",
            dateRange: dateRange.trim() === ""
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) {
            setErrorMessage("Пожалуйста, заполните все обязательные поля.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        const newSurvey = {
            id: Date.now(),
            title: courseTitle,
            faculty: facultyGroups.split(',')[0]?.trim() || 'СГН',
            course: '1',
            semester: dateRange,
            analytics: {
                scores: [0, 0, 0, 0, 0],
                comment: feedback || 'Опрос только что создан'
            }
        };

        navigate("/surveyTeacher", { state: { newSurvey } });
    };

    return (
        <div className={classes.page}>
            <Header />
            <h2 className={classes.heading}>Создание опроса</h2>

            <div className={classes.form}>
                {errorMessage && (
                    <div className={classes.errorPopup}>{errorMessage}</div>
                )}

                <label>Укажите название курса, в рамках которого проводится опрос.</label>
                <input
                    type="text"
                    className={errors.courseTitle ? classes.inputError : ""}
                    placeholder='"Высшая математика"'
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                />

                <label>Укажите факультет и номера групп, которым будет доступен этот опрос.</label>
                <input
                    type="text"
                    className={errors.facultyGroups ? classes.inputError : ""}
                    placeholder='"СГН3-41Б, СГН5-42Б, СГН5-43Б"'
                    value={facultyGroups}
                    onChange={(e) => setFacultyGroups(e.target.value)}
                />

                <label>Укажите даты, в которые будет доступен этот опрос.</label>
                <input
                    type="text"
                    className={errors.dateRange ? classes.inputError : ""}
                    placeholder='"20.05.2025-20.06.2025"'
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                />

                {questions.map((q, idx) => (
                    <div key={idx} className={classes.questionBlock}>
                        <label className={classes.questionLabel}>
                            {idx + 1}. {q.text || "Введите Ваш вопрос."}
                        </label>
                        <input
                            type="text"
                            placeholder="Введите Ваш вопрос."
                            value={q.text}
                            onChange={(e) => handleQuestionChange(idx, e.target.value)}
                        />

                        <div className={classes.answerFormat}>
                            <label>Формат ответа:</label>
                            <select
                                value={q.type}
                                onChange={(e) => handleTypeChange(idx, e.target.value)}
                            >
                                <option value="scale">Шкала от 1 до 5</option>
                                <option value="text">Развёрнутый ответ</option>
                            </select>
                        </div>

                        {q.type === "scale" && (
                            <div className={classes.starsPreview}>★ ★ ★ ★ ★</div>
                        )}

                        {q.type === "text" && (
                            <textarea
                                className={classes.textarea}
                                placeholder="Введите развернутый ответ"
                                value={q.answerText}
                                onChange={(e) => handleAnswerTextChange(idx, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                <button className={classes.addButton} onClick={handleAddQuestion}>
                    + Добавить вопрос
                </button>

                <div className={classes.questionBlock}>
                    <label className={classes.questionLabel}>
                        {questions.length + 1}. Оставьте отзыв (развёрнутый ответ)
                    </label>
                    <textarea
                        className={classes.textarea}
                        placeholder="Оставьте свой отзыв"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>

                <button className={classes.submitButton} onClick={handleSubmit}>
                    Создать кастомный опрос
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default CreateSurveyPage;
