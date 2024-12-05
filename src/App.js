import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home"; 
import AboutUs from "./pages/AboutUs";
import Features from "./pages/Features";
import ContactUs from "./pages/ContactUs";
import SignIn from "./pages/SignIn";
import MainPage from "./pages/MainPage";
import LessonsPage from "./pages/LessonsPage";
import MathMemoryGame from "./pages/MathMemoryGame";
import MathSpeedyQuiz from "./pages/MathSpeedyQuiz";
import LearningBuddy from "./pages/LearningBuddy";
import Leaderboard from "./pages/Leaderboard";
import ProgressTracking from "./pages/ProgressTracking";
<<<<<<< Updated upstream
=======
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import TeacherAdminPage from "./pages/TeacherAdminPage";
import TeacherQuiz from './pages/TeacherQuiz';
import TeacherLessons from './pages/TeacherLessons';

>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/math-memory-game" element={<MathMemoryGame />} />
        <Route path="/math-speedy-quiz" element={<MathSpeedyQuiz />} />
        <Route path="/lessons-page" element={<LessonsPage />} />
        <Route path="/learning-buddy" element={<LearningBuddy />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/progress-tracking" element={<ProgressTracking />} />
<<<<<<< Updated upstream
=======
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/TeacherAdminPage" element={<TeacherAdminPage />} />
        <Route path="/teacher-quiz" element={<TeacherQuiz />} />
        <Route path="/teacher-lessons" element={<TeacherLessons />} />
>>>>>>> Stashed changes
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;