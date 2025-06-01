import React, { useState, useEffect } from "react";
import Header from "../../components/Header/header.jsx";
import Footer from "../../components/Footer/footer.jsx";
import classes from "./createsurveyPage.module.css";
import { createSurvey, fetchGroups, fetchSubjects } from "../../api.ts";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

// Типы вопросов
const questionTypes = [
  { value: "single_choice", label: "Один вариант" },
  { value: "multiple_choice", label: "Несколько вариантов" },
  { value: "text", label: "Открытый ответ" },
];

const CreateSurveyPage = () => {
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([
    {
      title: "",
      questions: [{ text: "", type: "single_choice", options: [""] }],
    },
  ]);
  const [sending, setSending] = useState(false);
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    fetchGroups().then((data) => {
      setGroups(data);
      if (data.length > 0) setGroup(data[0].groupName);
    });
    fetchSubjects().then((data) => {
      setSubjects(data);
      if (data.length > 0) setSubject(data[0].subjectName);
    });
  }, [user]);

  // Секции
  const handleSectionTitleChange = (sectionIdx, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === sectionIdx ? { ...s, title: value } : s))
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        title: "",
        questions: [{ text: "", type: "single_choice", options: [""] }],
      },
    ]);
  };

  const removeSection = (sectionIdx) => {
    setSections((prev) => prev.filter((_, i) => i !== sectionIdx));
  };

  // Вопросы
  const handleQuestionChange = (sectionIdx, qIdx, value) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx ? { ...q, text: value } : q
              ),
            }
          : s
      )
    );
  };

  const handleTypeChange = (sectionIdx, qIdx, value) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx
                  ? {
                      ...q,
                      type: value,
                      options:
                        value === "text"
                          ? []
                          : q.options && q.options.length
                          ? q.options
                          : [""],
                    }
                  : q
              ),
            }
          : s
      )
    );
  };

  const handleOptionChange = (sectionIdx, qIdx, optIdx, value) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx
                  ? {
                      ...q,
                      options: q.options.map((opt, oi) =>
                        oi === optIdx ? value : opt
                      ),
                    }
                  : q
              ),
            }
          : s
      )
    );
  };

  const addOption = (sectionIdx, qIdx) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx ? { ...q, options: [...q.options, ""] } : q
              ),
            }
          : s
      )
    );
  };

  const removeOption = (sectionIdx, qIdx, optIdx) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              questions: s.questions.map((q, qi) =>
                qi === qIdx
                  ? {
                      ...q,
                      options: q.options.filter((_, oi) => oi !== optIdx),
                    }
                  : q
              ),
            }
          : s
      )
    );
  };

  const addQuestion = (sectionIdx) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              questions: [
                ...s.questions,
                { text: "", type: "single_choice", options: [""] },
              ],
            }
          : s
      )
    );
  };

  const removeQuestion = (sectionIdx, qIdx) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              questions: s.questions.filter((_, qi) => qi !== qIdx),
            }
          : s
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const payload = {
      author: user?.username || "",
      group: group,
      subject: subject,
      title: title,
      description: description,
      isStandart: false,
      questionsJson: sections.map((section, idx) => ({
        title: section.title || `Блок ${idx + 1}`,
        questions: section.questions.map((q) => ({
          type: q.type,
          text: q.text,
          options: q.type === "text" ? [] : q.options,
        })),
      })),
    };

    try {
      await createSurvey(payload);
      alert("Опрос успешно создан!");
      navigate("/surveys");
    } catch (e) {
      alert("Ошибка при создании опроса");
      console.log(e);
      console.log("Payload:", payload);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={classes.page}>
      <Header />
      <main className={classes.main}>
        <h1 className={classes.title}>Создание опроса</h1>
        <form className={classes.form} onSubmit={handleSubmit}>
          <label className={classes.label}>Название опроса</label>
          <input
            className={classes.input}
            type="text"
            placeholder="Введите название опроса"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className={classes.label}>Описание опроса</label>
          <textarea
            className={classes.textarea}
            placeholder="Введите описание опроса"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className={classes.row}>
            <div className={classes.selectBlock}>
              <label className={classes.label}>Группа</label>
              <select
                className={classes.select}
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                required
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.groupName}>
                    {g.groupName}
                  </option>
                ))}
              </select>
            </div>
            <div className={classes.selectBlock}>
              <label className={classes.label}>Предмет</label>
              <select
                className={classes.select}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.subjectName}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={classes.sectionsHeader}>
            <span>Секции опроса</span>
            <button
              type="button"
              className={classes.addSectionBtn}
              onClick={addSection}
            >
              + Добавить секцию
            </button>
          </div>

          {sections.map((section, sectionIdx) => (
            <div className={classes.sectionBlock} key={sectionIdx}>
              <div className={classes.sectionHeader}>
                <input
                  className={classes.sectionTitleInput}
                  type="text"
                  placeholder={`Название секции (например, "Общие вопросы")`}
                  value={section.title}
                  onChange={(e) =>
                    handleSectionTitleChange(sectionIdx, e.target.value)
                  }
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    className={classes.removeSectionBtn}
                    onClick={() => removeSection(sectionIdx)}
                    title="Удалить секцию"
                  >
                    ×
                  </button>
                )}
              </div>
              {section.questions.map((q, qIdx) => (
                <div className={classes.questionBlock} key={qIdx}>
                  <div className={classes.qHeader}>
                    <label className={classes.questionLabel}>
                      {qIdx + 1}.{" "}
                      <input
                        className={classes.qInput}
                        type="text"
                        placeholder="Текст вопроса"
                        value={q.text}
                        onChange={(e) =>
                          handleQuestionChange(sectionIdx, qIdx, e.target.value)
                        }
                        required
                      />
                    </label>
                    <button
                      type="button"
                      className={classes.removeBtn}
                      onClick={() => removeQuestion(sectionIdx, qIdx)}
                      title="Удалить вопрос"
                      disabled={section.questions.length === 1}
                    >
                      ×
                    </button>
                  </div>
                  <div className={classes.typeRow}>
                    <label>Тип:</label>
                    <select
                      className={classes.qTypeSelect}
                      value={q.type}
                      onChange={(e) =>
                        handleTypeChange(sectionIdx, qIdx, e.target.value)
                      }
                    >
                      {questionTypes.map((qt) => (
                        <option key={qt.value} value={qt.value}>
                          {qt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(q.type === "single_choice" ||
                    q.type === "multiple_choice") && (
                    <div className={classes.optionsBlock}>
                      <label>Варианты ответа:</label>
                      {q.options.map((opt, optIdx) => (
                        <div className={classes.optionRow} key={optIdx}>
                          <input
                            className={classes.optionInput}
                            type="text"
                            placeholder={`Вариант ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(
                                sectionIdx,
                                qIdx,
                                optIdx,
                                e.target.value
                              )
                            }
                            required
                          />
                          {q.options.length > 1 && (
                            <button
                              type="button"
                              className={classes.removeOptBtn}
                              onClick={() =>
                                removeOption(sectionIdx, qIdx, optIdx)
                              }
                              title="Удалить вариант"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className={classes.addOptBtn}
                        onClick={() => addOption(sectionIdx, qIdx)}
                      >
                        + Добавить вариант
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                className={classes.addQuestionBtn}
                onClick={() => addQuestion(sectionIdx)}
              >
                + Добавить вопрос
              </button>
            </div>
          ))}

          <button
            className={classes.submitBtn}
            type="submit"
            disabled={sending}
          >
            {sending ? "Создание..." : "Создать опрос"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateSurveyPage;
