import React, { useState } from 'react';
import './App.css';
import SearchBar from "./components/SearchBar";
import BookList from './components/BookList';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    searchType: 'title',
    searchTerm: '',
    startYear: 1600,
    endYear: new Date().getFullYear(),
  });

  const handleSearch = (searchType: string, term: string, startYear: number, endYear: number) => {
    setSearchParams({ searchType, searchTerm: term, startYear, endYear });
  };

  return (
    <div className='main'>
      <h1 className='title'>Library</h1>
      <SearchBar onSearch={handleSearch} />
      <BookList {...searchParams} />
    </div>
  );
};

export default App;