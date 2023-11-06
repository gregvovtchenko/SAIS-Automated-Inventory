require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
const PORT = 3001;

app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || '',
  connectionLimit: 10
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log('Connected to the MySQL database.');
  connection.release();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.post('/addProduct', (req, res) => {
  const { productID, productName, weight } = req.body;

  if (!productID || !productName || typeof weight !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }

  const query = 'INSERT INTO Products (productID, productName, weight) VALUES (?, ?, ?)';
  
  pool.query(query, [productID, productName, weight], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.status(201).json({ success: true });
  });
});

app.get('/getProduct', (req, res) => {
  const productID = req.query.productID;

  if (!productID) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  const query = 'SELECT * FROM Products WHERE productID = ?';

  pool.query(query, [productID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      const product = results[0];
      res.status(200).json({ success: true, productName: product.productName, productID: product.productID, weight: product.weight });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  });
});
