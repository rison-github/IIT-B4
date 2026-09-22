const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const app = express();
const port = 3000;
// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//Connect to SQLite database
function createConnection()
    {
        return new sqlite3.Database('expns-db.db');
    }
//Create expenses table if not exists
function createTable()
    {
        const connection = createConnection();
        connection.run(
            `
                CREATE TABLE IF NOT EXISTS expenses
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        amount REAL,
                        category TEXT,
                        date TEXT
                    )
            `
        );
        connection.close();
    }
// Routes
app.get('/', (req, res) => {
    // Fetch total expenses and expenses by category
    connection.all(`
      SELECT category, SUM(amount) AS total
      FROM expenses
      GROUP BY category
    `, (err, rows) => {
      const totalExpenses = rows;
      // Fetch total expenses
      connection.get('SELECT SUM(amount) AS total FROM expenses', (err, row) => {
        const total = row ? row.total : 0;
        res.render('index', { total, totalExpenses });
      });
    });
  });
createTable();
app.get('/',
    (req, res) =>
        {
            res.render('index');
        });
app.post('/adExpense',
    (req, res) =>
        {
            const
                {
                    amount, category, date
                }
            = req.body;
            const connection = createConnection();
            connection.run('INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)',
                    [amount, category, date],
                    function(err)
                    {
                        if (err)
                            {
                                console.error(err.message);
                                res.status(500).send('Internal Server Error');
                            }
                        else
                            {
                                // Fetch total expenses and expenses by category
                                connection.all(`
                                SELECT category, SUM(amount) AS total
                                FROM expenses
                                GROUP BY category
                              `, (err, rows) => {
                                const totalExpenses = rows;
                        
                                // Fetch total expenses
                                connection.get('SELECT SUM(amount) AS total FROM expenses', (err, row) => {
                                  const total = row ? row.total : 0;
                                  res.json({ total, totalExpenses });
                                });
                              });
                            }
                    });
            connection.close();
        });
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('constant', 'constant');
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
