import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Header from "./components/common/Header";
import Container from "./components/layout/Container";

import StudentList from "./pages/StudentList";
import StudentProfile from "./pages/StudentProfile";
import AddStudent from "./components/student/AddStudent";
import EditStudent from "./components/student/EditStudent";
import NotFound from "./pages/NotFound";

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
              <Route path="/add" element={<AddStudent />} />
              <Route path="/edit/:id" element={<EditStudent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
