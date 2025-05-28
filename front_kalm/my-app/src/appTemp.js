// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage/mainPage.jsx";
import RestorePage from "./pages/RestorePassword/restorePage.jsx";

import MainAuthPage from "./pages/MainAuthPage/mainAuthPage.jsx";

import SearchPage from "./pages/SearchPage/searchPage.jsx";
import SurveyTeacher from "./pages/SurveyTeacher/surveyTeacher.jsx";
import CreateSurveyPage from "./pages/CreateSurveyPage/createsurveyPage.jsx";

import TeacherPage from "./pages/TeacherPage/teacherPage.jsx";
import CabinetStudentPage from "./pages/CabinetStudent/cabinetStudentPage.jsx";
import CabinetTeacherPage from "./pages/CabinetTeacher/cabinetTeacherPage.jsx";

// Новый импорт
import SurveyPage from "./pages/SurveyPage/surveyPage.jsx";
import SurveyDetailPage from "./pages/SurveyTest/surveyTestPage.jsx";
import { SurveysProvider } from "./pages/SurveyTest/SurveysContext.jsx";

import './assets/Fonts/fonts.css';

function App() {
  return (
    <BrowserRouter>
      <SurveysProvider>
        <Routes>
          {/* публичная главная */}
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />

          {/* авторизация */}
          <Route path="/restore" element={<RestorePage />} />

          {/* защищённая главная */}
          <Route path="/MainAuthPage" element={<MainAuthPage />} />

          {/* поиск преподавателей */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/teacher/:teacherId" element={<TeacherPage />} />

          {/* кабинет */}
          <Route path="/cabinet" element={<CabinetStudentPage />} />
          <Route path="/cabinet-teach" element={<CabinetTeacherPage />} />

          {/* опросы */}
          <Route path="/surveys" element={<SurveyPage />} />
          <Route path="/survey/:surveyId" element={<SurveyDetailPage />} />

          {/* страницы для преподавателя */}
          <Route path="/survey-teacher" element={<SurveyTeacher />} />
          <Route path="/create-survey" element={<CreateSurveyPage />}/> 

          {/* catch-all, можно добавить 404 */}
        </Routes>
      </SurveysProvider>
    </BrowserRouter>
  );
}

export default App;