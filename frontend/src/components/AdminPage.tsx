import React, { useEffect, useState } from 'react';


const AdminPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !author || !year || !image) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year.toString());
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/add-book', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      alert('Book added successfully!');
      setTitle('');
      setAuthor('');
      setYear('');
      setImage(null);
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book');
    }
  };

  return (
    <div className='adminpageBody'>
      <button className="rightCornerButton" onClick={() => window.location.reload()}>Back to Library</button>
      <div className="admin-container">
        <h2 className="admin-title">Add a New Book</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              placeholder="Enter book author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              placeholder="Enter publication year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <button className="submit-button" type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
