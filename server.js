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

// Route to capture bulk tree orders from the map
app.post('/submitOrder', (req, res) => {
    const { treeOrders } = req.body; // Expects an array of tree order objects

    const query = `INSERT INTO tree_orders (address, num_trees) VALUES ?`;
    const values = treeOrders.map(order => [order.address, order.num_trees]);

    db.query(query, [values], (err, result) => {
        if (err) throw err;
        res.send({ success: true, order_ids: result.insertId });
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

// New endpoint to handle donations and store the number of trees
app.post('/api/donate', (req, res) => {
    const { trees } = req.body;

    const query = `INSERT INTO donations (trees) VALUES (?)`;
    db.query(query, [trees], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Donation recorded successfully', donation_id: result.insertId });
    });
});

// New endpoint to get the latest donation (could be used on pay.html)
app.get('/api/latest-donation', (req, res) => {
    const query = `SELECT * FROM donations ORDER BY id DESC LIMIT 1`;

    db.query(query, (err, results) => {
        if (err) throw err;
        const latestDonation = results[0]; // Get the latest donation
        res.json(latestDonation || { trees: 0 });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
