require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const os = require('os');
const util = require('util');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Initialize the express application
const app = express();

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

// Define the port from environment variable or fallback to default
const PORT = process.env.PORT || 3001;

// Database pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || '',
  connectionLimit: 10
});

// Function to get the server IP address
function getServerIPAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceDetails of Object.values(networkInterfaces)) {
    for (const details of interfaceDetails) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }

  // Return localhost if no external IP found
  return '127.0.0.1';
}

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log('Connected to the MySQL database.');
  connection.release(); // release the connection back to the pool

  app.listen(PORT, () => {
    console.log(`Server is running at http://${getServerIPAddress()}:${PORT}`);
  });
});

pool.query = util.promisify(pool.query);

async function executeQuery(sql, params) {
  return await pool.query(sql, params);
}
// Get inventory list
app.get('/getInventoryList', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM Products', []);
    res.json(results);
  } catch (error) {
    console.error('Error getting products list:', error.message);
    res.status(500).send('Server error');
  }
});

// Add item to inventory
// Add item to inventory
app.post('/addItemToInventory', async (req, res) => {
  const { productName, productType, supplierID, activeStatus } = req.body;

  try {
    // Check if the product already exists in the database
    const checkSql = 'SELECT * FROM Products WHERE productName = ?';
    const existingProducts = await executeQuery(checkSql, [productName]);

    if (existingProducts.length > 0) {
      // Product already exists
      res.status(409).json({ message: 'Product already exists.' });
    } else {
      // Product does not exist, add to database
        const insertSql = 'INSERT INTO Products (productName, productType, supplierID, activeStatus) VALUES (?, ?, ?, ?)';
        const insertResult = await executeQuery(insertSql, [productName, productType, supplierID, activeStatus]);
        const newProductID = insertResult.insertId;
        res.json({ productID: newProductID, message: 'Product added successfully.' });
    }
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).send('Server error');
  }
});

app.post('/addSupplier', async (req, res) => {
  const { supplierName, contactDetails } = req.body;

  try {
      // Check if the supplier already exists
      const checkSql = 'SELECT * FROM Suppliers WHERE supplierName = ?';
      const existingSuppliers = await executeQuery(checkSql, [supplierName]);

      if (existingSuppliers.length > 0) {
          // Supplier already exists
          res.status(409).json({ message: 'Supplier already exists.' });
      } else {
          // Supplier does not exist, add to database
          const insertSql = 'INSERT INTO Suppliers (supplierName, contactDetails) VALUES (?, ?)';
          await executeQuery(insertSql, [supplierName, contactDetails]);
          res.json({ message: 'Supplier added successfully.' });
      }
  } catch (error) {
      console.error('Error adding supplier:', error.message);
      res.status(500).send('Server error');
  }
});
// Fetch all suppliers
app.get('/getSuppliers', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM Suppliers', []);
    res.json(results);
  } catch (error) {
    console.error('Error getting suppliers list:', error.message);
    res.status(500).send('Server error');
  }
});

app.delete('/deleteSupplier/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Suppliers WHERE supplierID = ?';
  try {
    await executeQuery(sql, [id]);
    res.json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    console.error('Error deleting supplier:', error.message);
    res.status(500).send('Server error');
  }
});






// Update inventory item
app.put('/updateInventory', async (req, res) => {
  const { id, productName, quantity, price } = req.body;
  const sql = 'UPDATE Inventory SET productName = ?, quantity = ?, price = ? WHERE id = ?';
  try {
    await executeQuery(sql, [productName, quantity, price, id]);
    res.json({ message: 'Inventory item updated successfully.' });
  } catch (error) {
    console.error('Error updating inventory item:', error.message);
    res.status(500).send('Server error');
  }
});

// Delete inventory item
app.delete('/deleteInventoryItem/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Products WHERE productID= ?';
  try {
    await executeQuery(sql, [id]);
    res.json({ message: 'Inventory item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting inventory item:', error.message);
    res.status(500).send('Server error');
  }
});

// Endpoint to log item movement
app.post('/recordMovement', async (req, res) => {
  const { productId, movementType, quantity } = req.body;
  const sql = 'INSERT INTO ItemMovements (productId, movementType, quantity) VALUES (?, ?, ?)';
  try {
    await executeQuery(sql, [productId, movementType, quantity]);
    res.json({ message: 'Item movement recorded successfully.' });
  } catch (error) {
    console.error('Error recording item movement:', error.message);
    res.status(500).send('Server error');
  }
});

// Fetch a single product's details
app.get('/getProductById/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await executeQuery('SELECT * FROM Products WHERE productID = ?', [id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).send('Server error');
  }
});

// Fetch item movements
app.get('/fetchItemMovements', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM ItemMovements', []);
    res.json(results);
  } catch (error) {
    console.error('Error fetching item movements:', error.message);
    res.status(500).send('Server error');
  }
});




// USER INFO

// Register User
app.post('/registerUser', async (req, res) => {
  const { userName, passwordHash, roleName } = req.body; // Ensure these match your frontend

  try {
      const checkSql = 'SELECT * FROM Users WHERE userName = ?';
      const existingUsers = await executeQuery(checkSql, [userName]);

      if (existingUsers.length > 0) {
          res.status(409).json({ message: 'User already exists.' });
      } else {
          // Before inserting, hash the password. Assuming you're using bcrypt for password hashing
          const hashedPassword = await bcrypt.hash(passwordHash, 10);

          const insertSql = 'INSERT INTO Users (userName, passwordHash, roleName) VALUES (?, ?, ?)';
          await executeQuery(insertSql, [userName, hashedPassword, roleName]);
          res.json({ message: 'User added successfully.' });
      }
  } catch (error) {
      console.error('Error adding user:', error.message);
      res.status(500).send('Server error');
  }
});


// Login User
app.post('/loginUser', async (req, res) => {
  const { userName, password } = req.body; // Assuming the frontend sends 'password' instead of 'passwordHash'

  try {
    // Check if the user exists in the database
    const checkSql = 'SELECT * FROM Users WHERE userName = ?';
    const user = await executeQuery(checkSql, [userName]);

    if (user.length === 0) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Check if the password matches the hashed password
    const hashedPassword = user[0].passwordHash;
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      res.status(401).json({ message: 'Incorrect password.' });
      return;
    }

    // Password is correct, user is logged in
    res.json({ message: 'Login successful.' });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).send('Server error');
  }
});

// Record Movements
app.post('/api/recordMovement', async (req, res) => {
  const { productID, amount, mode } = req.body;

  try {
    // Check if the mode is "Staff"
    if (mode === "Staff") {
      // Insert the movement record into the database
      const insertSql = 'INSERT INTO Movements (productID, amount, mode) VALUES (?, ?, ?)';
      await executeQuery(insertSql, [productID, amount, mode]);

      res.status(200).json({ message: 'Movement recorded successfully.' });
    } else {
      res.status(403).json({ message: 'Access Denied: Only "Staff" mode is allowed.' });
    }
  } catch (error) {
    console.error('Error recording movement:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});



