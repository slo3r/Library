import React from 'react';

export interface BookProps {
    id: number;
    title: string;
    author: string;
    year: number;
    image: string;
}

const Book: React.FC<BookProps> = ({ title, author, year, image }) => {
    return (
        <div className='Book'>
            <div className='bookTitle'>{title}</div>
            <img src={`./images/${image}`} alt={title} />
            <div className='bookAuthor'>{author}</div>
            <div className='bookYear'>{year}</div>
        </div>
    );
};

export default Book;
