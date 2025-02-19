import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';

const App = () => {

  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<HomePage/>} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
};

export default App;