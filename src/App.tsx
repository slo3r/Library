import React from 'react';
import './App.css';
import SearchBar from "./components/SearchBar";
import Book from './components/Book';
import AdminPage from './components/AdminPage';

function App() {

  return (
    <div className='main'>
      {/* <h1 className='title'>Library</h1>
      <SearchBar /> */}
      <AdminPage />
     
    </div>
  );
}


export default App;
