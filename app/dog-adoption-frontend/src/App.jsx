import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import { Container } from '@mui/material';
import './App.css'; 
import Navbar from './pages/Navbar';

function App() {
  return (
    <Container maxWidth="lg" sx={{ padding: 2 }} className="login-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Container>
  );
}

export default App;
