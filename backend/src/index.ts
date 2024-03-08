import express, {Express, Request, Response} from 'express';
import { createConnection } from 'mysql2';

const app:Express = express();
const PORT = process.env.PORT || 5000;

// MySQL connection 
const db = createConnection({
    host: 'localhost',
    user: 'root',
    database: 'library'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
