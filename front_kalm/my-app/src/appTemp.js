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

// Новый импорт
import SurveyPage from "./pages/SurveyPage/surveyPage.jsx";
import SurveyDetailPage from "./pages/SurveyTest/surveyTestPage.jsx";
import { SurveysProvider } from "./pages/SurveyTest/SurveysContext.jsx";

import "./assets/Fonts/fonts.css";
import { UserProvider } from "./context/UserContext.jsx";

function App() {
  
  return (
    <BrowserRouter>
      <UserProvider>
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
            <Route path="/teacher-reviews" element={<TeacherPage />} />

            {/* кабинет */}
            <Route path="/cabinet" element={<CabinetStudentPage />} />

            {/* опросы */}
            <Route path="/surveys" element={<SurveyPage />} />
            <Route path="/survey/:surveyId" element={<SurveyDetailPage />} />

            {/* страницы для преподавателя */}
            <Route path="/survey-teacher" element={<SurveyTeacher />} />
            <Route path="/create-survey" element={<CreateSurveyPage />} />

            {/* catch-all, можно добавить 404 */}
          </Routes>
        </SurveysProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
