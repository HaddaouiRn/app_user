const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'mariadb',
    user: 'root',
    password: 'rania',
    database: 'userdb'
});


function createUsersTable() {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS users  (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            prenom VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            telephone VARCHAR(255)
        )
    `;
    connection.query(createTableSql, (err) => {
        if (err) throw err;
        console.log("Table users created or already exists.");
    });
}

app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send({ error: "Database error!" });
        res.json(results);
    });
});

app.post('/user', (req, res) => {
    const { nom, prenom, email, telephone } = req.body;
    connection.query('INSERT INTO users (nom, prenom, email, telephone) VALUES (?, ?, ?, ?)', 
    [nom, prenom, email, telephone], (err) => {
        if (err) {
            console.error("MySQL error:", err.message);
            return res.status(500).send("Failed to add user.");
        }
        res.redirect('/');
    });
});

app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    // Utilisez userId pour supprimer l'utilisateur de la base de données
    connection.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) return res.status(500).send("Erreur lors de la suppression de l'utilisateur.");
        res.sendStatus(204);
    });
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MariaDB');
    createUsersTable();
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
});

