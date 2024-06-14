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
    const searchTerm = req.query.term;
    const sql = 'SELECT * FROM books WHERE title LIKE ?'; 
    db.query(sql, [`%${searchTerm}%`], (err, result) => {
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
