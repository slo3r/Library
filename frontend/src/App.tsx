import React, { useState } from 'react';
import './App.css';
import SearchBar from "./components/SearchBar";
import Book from './components/Book';
import AdminPage from './components/AdminPage';
import BookList from './components/BookList';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className='main'>
      <h1 className='title'>Library</h1>
      <SearchBar onSearch={handleSearch} />
      <BookList searchTerm={searchTerm} />
     
    </div>
  );
}


export default App;
