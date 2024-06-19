import express, { Express, Request, Response } from 'express';
import { createConnection, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

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

const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

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

// Route for user login
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log('Login attempt:', { username, password });

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const sql = 'SELECT username, password FROM users WHERE username = ?';

  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error executing MySQL query' });
      return;
    }

    const rows = result as RowDataPacket[];

    if (rows.length === 0) {
      console.log('Username not found');
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Password does not match');
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    console.log('Login successful');
    res.json({ message: 'Login successful!' });
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

  ensureDirectoryExistence(imagePath);

  console.log('Directory Path:', imageDir);
  console.log('File Path:', imagePath);

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

// Route to edit a book
app.put('/edit-book/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  const file = req.files?.image as UploadedFile;

  if (!title || !author || !year) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  let sql = 'UPDATE books SET title = ?, author = ?, year = ?';
  const params: (string | number)[] = [title, author, year];

  if (file) {
    const imageDir = path.join(__dirname, '../../frontend/public/images');
    const imagePath = path.join(imageDir, file.name);

    ensureDirectoryExistence(imagePath);

    file.mv(imagePath, (err: any) => {
      if (err) {
        console.error('Error moving file: ', err);
        res.status(500).json({ error: 'Error moving file' });
        return;
      }
    });

    sql += ', image = ?';
    params.push(file.name);
  }

  sql += ' WHERE id = ?';
  params.push(Number(id));

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error executing MySQL query' });
      return;
    }
    res.json({ message: 'Book updated successfully!' });
  });
});

// Route to delete a book
app.delete('/delete-book/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const sql = 'DELETE FROM books WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error executing MySQL query' });
      return;
    }
    res.json({ message: 'Book deleted successfully!' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
