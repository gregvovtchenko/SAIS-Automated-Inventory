import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [nfcData, setNfcData] = useState({}); // State for NFC data
  const [message, setMessage] = useState('');

  // Fetch inventory list from backend
  useEffect(() => {
    setLoading(true);
    axios.get('/api/getInventoryList')
      .then(response => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error fetching inventory');
        setLoading(false);
      });
  }, []);

  // Add item to inventory with NFC
  const addItemToInventory = async (itemData) => {
    try {
      const responseESP = await axios.post('/arduino/write', itemData);

      if(responseESP.data.success){
        const responseBackend = await axios.post('/api/addItemToInventory', itemData);
        
        if(responseBackend.data.success){
          setInventory(prevInventory => [...prevInventory, responseBackend.data]);
          setMessage('Item added to inventory successfully!');
        } else {
          setMessage('Failed to add item to database.');
        }
      } else {
        setMessage('Failed to write data to NFC tag.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  // Read NFC tag and delete item from inventory
  const deleteInventoryItem = async (itemId) => {
    try {
      const responseESP = await axios.get('/arduino/read');

      if (responseESP.status === 200 && responseESP.data.productID === itemId) {
        const responseBackend = await axios.delete(`/api/deleteInventoryItem/${itemId}`);

        if(responseBackend.data.success){
          setInventory(prevInventory => prevInventory.filter(item => item.id !== itemId));
          setMessage('Item deleted from inventory successfully!');
        } else {
          setMessage('Failed to delete item from database.');
        }
      } else {
        setMessage('Failed to read data from NFC tag.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  // Assume the function receives an item object with properties including productID, productName, quantity, etc.

  const updateInventoryItem = async (item) => {
    try {
      // First, write the updated data to the NFC tag
      const responseESP = await axios.post('/arduino/write', {
        productID: item.productID,
        productName: item.productName,
        quantity: item.quantity,
        // Include any other relevant data
      });

      if (responseESP.data.success) {
        // If NFC write is successful, update the inventory item in the backend
        const responseBackend = await axios.put('/api/updateInventory', item);

        if (responseBackend.data.success) {
          // Update the local inventory state
          setInventory(prevInventory => prevInventory.map(invItem => 
            invItem.productID === item.productID ? { ...invItem, ...item } : invItem
          ));
          setMessage('Inventory item updated successfully!');
        } else {
          setMessage('Failed to update item in the database.');
        }
      } else {
        setMessage('Failed to write updated data to NFC tag.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Inventory Management</h1>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                {/* Buttons for editing and deleting inventory items */}
                <button onClick={() => {/* function to handle edit */}}>Edit</button>
                <button onClick={() => deleteInventoryItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;
