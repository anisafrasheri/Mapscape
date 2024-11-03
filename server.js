const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'root',
    database: 'TreePlantingDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Route to capture tree orders from the map
app.post('/submitOrder', (req, res) => {
    const { address, num_trees } = req.body;

    const query = `INSERT INTO tree_orders (address, num_trees) VALUES (?, ?)`;
    db.query(query, [address, num_trees], (err, result) => {
        if (err) throw err;
        res.send({ order_id: result.insertId });
    });
});

// Route to capture payment details
app.post('/submitPayment', (req, res) => {
    const { cardholder_name, card_number, expiry_date, cvv, email, total_price, order_id } = req.body;

    const query = `INSERT INTO payments (cardholder_name, card_number, expiry_date, cvv, email, total_price, order_id) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [cardholder_name, card_number, expiry_date, cvv, email, total_price, order_id], (err, result) => {
        if (err) throw err;
        res.send({ success: true, payment_id: result.insertId });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
