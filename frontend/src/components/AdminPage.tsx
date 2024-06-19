import React, { useEffect, useState } from 'react';

const AdminPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Search state
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchStartYear, setSearchStartYear] = useState<number | '1600'>('1600');
  const [searchEndYear, setSearchEndYear] = useState<number | '2024'>('2024');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (searchParams = {}) => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`http://localhost:5000/books-search?${query}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

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
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book');
    }
  };

  const handleEdit = (book: any) => {
    setIsEditing(true);
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
    setCurrentImageUrl(book.image);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!title || !author || !year) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year.toString());
    if (image) formData.append('image', image);

    try {
      const response = await fetch(`http://localhost:5000/edit-book/${selectedBook.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      alert('Book updated successfully!');
      setIsModalOpen(false);
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error updating book');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/delete-book/${selectedBook.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      alert('Book deleted successfully!');
      setIsModalOpen(false);
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book');
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams = {
      title: searchTitle,
      author: searchAuthor,
      startYear: searchStartYear,
      endYear: searchEndYear,
    };
    await fetchBooks(searchParams);
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
        <hr />
        <h2>Books</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <div className='row'>
            <div className='column'>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  id="searchTitle"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Author:</label>
                <input
                  type="text"
                  id="searchAuthor"
                  placeholder="Search by author"
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                />
              </div>
            </div>
            <div className='column'>
              <div className="form-group">
                <label>From:</label>
                <input
                  type="number"
                  id="searchStartYear"
                  placeholder="Search from year"
                  value={searchStartYear}
                  onChange={(e) => setSearchStartYear(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>To:</label>
                <input
                  type="number"
                  id="searchEndYear"
                  placeholder="Search to year"
                  value={searchEndYear}
                  onChange={(e) => setSearchEndYear(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <button className="submit-button" type="submit">Search</button>
        </form>
        <div className="book-list">
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <span><b>{book.title}</b> by {book.author} ({book.year})</span>
                <button onClick={() => handleEdit(book)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Book</h2>
              <div className='modal-form'>
                <img src={`./images/${currentImageUrl}`} alt={title} />

                <div className='modal-edit'>
                  <div className="form-groups">
                    <div className="form-group">
                      <label>Title:</label>
                      <input
                        type="text"
                        id="title"
                        placeholder="Enter book title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Author:</label>
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
                  </div>
                  <div className="button-group">
                    <button onClick={handleUpdate}>Update</button>
                    <button className='delete' onClick={handleDelete}>Delete</button>
                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
