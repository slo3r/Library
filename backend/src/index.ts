import express, {Express, Request, Response} from 'express';
import { createConnection } from 'mysql2';

const app:Express = express();
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
// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!');
});
// Routes
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


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
