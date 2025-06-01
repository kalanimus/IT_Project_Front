// src/App.jsx
import React from "react";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage/mainPage.jsx";

import MainAuthPage from "./pages/MainAuthPage/mainAuthPage.jsx";

import SearchPage from "./pages/SearchPage/searchPage.jsx";
import CreateSurveyPage from "./pages/CreateSurveyPage/createsurveyPage.jsx";

import TeacherPage from "./pages/TeacherPage/teacherPage.jsx";
import CabinetStudentPage from "./pages/CabinetStudent/cabinetStudentPage.jsx";

// Новый импорт
import SurveyPage from "./pages/SurveyPage/surveyPage.jsx";

import "./assets/Fonts/fonts.css";
import { UserProvider } from "./context/UserContext.jsx";
import PassSurveyPage from "./pages/PassSurveyPage/passSurveyPage.jsx";


function App() {
  
  return (
    <BrowserRouter>
      <UserProvider>
          <Routes>
            {/* публичная главная */}
            <Route path="/" element={<MainPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route element={<ProtectedRoute />}>
              {/* защищённая главная */}
              <Route path="/MainAuthPage" element={<MainAuthPage />} />

              {/* поиск преподавателей */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/teacher-reviews" element={<TeacherPage />} />

              {/* кабинет */}
              <Route path="/cabinet" element={<CabinetStudentPage />} />

              {/* опросы */}
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/PassSurveyPage" element={<PassSurveyPage />} />
              {/* страницы для преподавателя */}
              <Route path="/create-survey" element={<CreateSurveyPage />} />
            </Route>
          </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
