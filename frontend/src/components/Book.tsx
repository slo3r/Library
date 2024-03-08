import React, { useState } from 'react';
import '../App.css';

const Book = () => {


    return (
      <div className='Book'>
        <img src='#' alt='book' />
        <div className='bookTitle'>Title</div>
        <div className='bookAuthor'>Author</div>
        <div className='bookYear'>Year</div>
      </div>
    );
};

export default Book;
