import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import PublisherPage from './components/Publisher/PublisherPage';
import CategoryPage from './components/Category/CategoryPage';
import BookPage from './components/Book/BookPage';
import AuthorPage from './components/Author/AuthorPage';
import BorrowPage from './components/BookBorrow/BorrowPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/author" element={<AuthorPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/borrow" element={<BorrowPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/publisher" element={<PublisherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
