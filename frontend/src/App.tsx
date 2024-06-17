import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import AdminPage from './components/AdminPage';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    searchType: 'title',
    searchTerm: '',
    startYear: 1600,
    endYear: new Date().getFullYear(),
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSearch = (searchType: string, term: string, startYear: number, endYear: number) => {
    setSearchParams({ searchType, searchTerm: term, startYear, endYear });
  };

  if (isAdmin) {
    return <AdminPage />;
  }

  return (
    <div className='main'>
      <button className='rightCornerButton' onClick={() => setIsAdmin(true)}>Add Book</button>
      <h1 className='title'>Library</h1>
      <SearchBar onSearch={handleSearch} />
      <BookList {...searchParams} />
    </div>
  );
};

export default App;
