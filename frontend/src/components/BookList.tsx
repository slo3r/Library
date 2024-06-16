import React, { useEffect, useState } from 'react';
import Book, { BookProps } from './Book';

interface BookData extends BookProps {
  id: number;
}

interface BookListProps {
  searchType: string;
  searchTerm: string;
  startYear: number;
  endYear: number;
}

const BookList: React.FC<BookListProps> = ({ searchType, searchTerm, startYear, endYear }) => {
  const [books, setBooks] = useState<BookData[]>([]);

  useEffect(() => {
    fetchBooks();
  }, [searchType, searchTerm, startYear, endYear]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/search?type=${searchType}&term=${searchTerm}&startYear=${startYear}&endYear=${endYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data: BookData[] = await response.json();
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
