import React, { createContext, useState, useContext } from 'react';

// Ваши моки опросов
const initialSurveys = [
  { id: 1, title: 'Обратная связь по курсу “Интернет технологии”', teacher: 'Назаренко Н. В.', semester: 'Весенний семестр 2025', status: 'active' },
  { id: 2, title: 'Обратная связь по курсу “Программная инженерия”', teacher: 'Никулишина Т. А.', semester: 'Весенний семестр 2025', status: 'active' },
  { id: 3, title: 'Обратная связь по курсу “Политический анализ”', teacher: 'Бочарников И. В.', semester: 'Осенний семестр 2024', status: 'view' },
  { id: 4, title: 'Обратная связь по курсу “Социальные системы и процессы”', teacher: 'Галаганова С. Г.', semester: 'Осенний семестр 2024', status: 'disabled' },
  { id: 5, title: 'Обратная связь по курсу “Социология семьи и брака”', teacher: 'Зубова С. В.', semester: 'Весенний семестр 2025', status: 'active' },
  { id: 6, title: 'Обратная связь по курсу “История социологии”', teacher: 'Шайтанов М. М.', semester: 'Осенний семестр 2024', status: 'view' },
  { id: 7, title: 'Обратная связь по курсу “Методы сбора данных”', teacher: 'Овсянников А. Д.', semester: 'Весенний семестр 2025', status: 'disabled' },
  { id: 8, title: 'Обратная связь по курсу “Качественные методы”', teacher: 'Коган Л. М.', semester: 'Осенний семестр 2024', status: 'view' },
  { id: 9, title: 'Обратная связь по курсу “Качественные методы”', teacher: 'Коган Л. М.', semester: 'Осенний семестр 2024', status: 'view' },
];

const SurveysContext = createContext();

export const SurveysProvider = ({ children }) => {
  const [surveys, setSurveys] = useState(initialSurveys);
  return (
    <SurveysContext.Provider value={{ surveys, setSurveys }}>
      {children}
    </SurveysContext.Provider>
  );
};

export const useSurveys = () => useContext(SurveysContext);
