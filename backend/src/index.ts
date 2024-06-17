import express, { Express, Request, Response } from 'express';
import { createConnection } from 'mysql2';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// MySQL connection 
const db = createConnection({
  host: 'localhost',
  user: 'root',
  database: 'library',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specified HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
  next();
});

// Enable files upload
app.use(fileUpload());

// Ensure directory existence
const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// Static folder for images
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!!');
});

app.get('/books', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error executing MySQL query' });
      return;
    }
    res.json(result);
  });
});

app.get('/search', (req: Request, res: Response) => {
  const { type, term, startYear, endYear } = req.query;

  let sql = 'SELECT * FROM books WHERE ';
  const params: (string | number)[] = [];

  if (type === 'title') {
    sql += 'title LIKE ? AND ';
    params.push(`%${term}%`);
  } else if (type === 'author') {
    sql += 'author LIKE ? AND ';
    params.push(`%${term}%`);
  }

  sql += 'year BETWEEN ? AND ?';
  params.push(Number(startYear), Number(endYear));

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error executing MySQL query' });
      return;
    }
    res.json(result);
  });
});

// Route to add a new book
app.post('/add-book', async (req: Request, res: Response) => {
  const { title, author, year } = req.body;
  const file = req.files?.image as UploadedFile;

  if (!title || !author || !year || !file) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  const imageDir = path.join(__dirname, '../../frontend/public/images');
  const imagePath = path.join(imageDir, file.name);

  // Ensure the directory exists
  ensureDirectoryExistence(imagePath);

  // Debug: Log paths
  console.log('Directory Path:', imageDir);
  console.log('File Path:', imagePath);

  // Use mv() to place the file in the correct directory
  file.mv(imagePath, (err: any) => {
    if (err) {
      console.error('Error moving file: ', err);
      res.status(500).json({ error: 'Error moving file' });
      return;
    }

    const sql = 'INSERT INTO books (title, author, year, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, author, year, file.name], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Error executing MySQL query' });
        return;
      }
      res.json({ message: 'Book added successfully!' });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
