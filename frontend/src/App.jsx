import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { TodoWrapper } from './components/TodoWrapper';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import './App.css';
import RegisterPage from './components/RegisterPage';
import ResetPage from './components/ResetPage';
import { ToastContainer } from 'react-toastify';

function AppContent() {
  const location = useLocation(); 
  const hideNavbar = location.pathname === '/' || location.pathname==='/register' || location.pathname==='/reset';

  return (
    <div className="App w-full h-full">
      {!hideNavbar && <Navbar />} 
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/reset' element={<ResetPage />} />
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/todolist' element={<TodoWrapper />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
