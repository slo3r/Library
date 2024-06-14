// BookList.tsx
import React, { useState, useEffect } from 'react';
import Book from './Book';

interface BookProps {
  id: number;
  title: string;
  author: string;
  year: number;
  image: string;
}

const BookList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [books, setBooks] = useState<BookProps[]>([]);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm]);

  const fetchBooks = async () => {
    try {
      let url = 'http://localhost:5000/books';
      if (searchTerm) {
        url = `http://localhost:5000/search?term=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data: BookProps[] = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className='BookList'>
      {books.map(book => (
        <Book
          key={book.id}
          id={book.id}
          title={book.title}
          image={book.image}
          author={book.author}
          year={book.year}
        />
      ))}
    </div>
  );
};

export default BookList;
