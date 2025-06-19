import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import StudentList from "./pages/StudentList";
import StudentProfile from "./pages/StudentProfile";
import NotFound from "./pages/NotFound";

import Header from "./components/common/Header";
import Container from "./components/layout/Container";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
          <Header />
          <Container>
            <Routes>
              <Route path="/" element={<StudentList />} />
              <Route path="/student/:id" element={<StudentProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

