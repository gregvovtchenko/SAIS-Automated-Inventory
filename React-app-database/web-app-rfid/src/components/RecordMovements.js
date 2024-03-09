// RecordMovements.js
import React, { useState } from 'react';

const RecordMovements = () => {
  const [productID, setProductID] = useState('');
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle NFC tag scanning
  const handleScan = async () => {
    try {
      // Code to activate the NFC reader and scan the tag
      // You need to implement the integration with your NFC reader here.
      const scannedProductID = 'scanned_product_id_from_nfc'; // Placeholder
      setProductID(scannedProductID);
      // Also, fetch the current weight from the weight sensor
    } catch (err) {
      setError('Failed to scan NFC tag.');
    }
  };

  // Function to record the movement of the product
  const recordMovement = async (mode) => {
    try {
      // Send data to the backend API to record the movement
        // You need to implement the API call here.
  // The `mode` will determine whether the product is being added or removed.
  // `amount` should be the quantity being added or removed.
  
  const response = await fetch(`/api/recordMovement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productID,
      amount,
      mode, // 'add' or 'remove'
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to record movement');
  }

  const result = await response.json();
  setSuccessMessage(result.message);
  // Reset the form or state as needed
  setProductID('');
  setAmount(0);
} catch (err) {
  setError(err.message);
}
  };
return (
    <div>
    <h2>Record Movements</h2>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
    <div className="input-group mb-3">
    <input
      type="text"
      className="form-control"
      placeholder="Product ID"
      value={productID}
      onChange={(e) => setProductID(e.target.value)}
      disabled
    />
    <div className="input-group-append">
      <button className ="btn btn-outline-secondary" type="button" onClick={handleScan}>Scan NFC</button>
</div>
</div>

<div className="input-group mb-3">
    <input
      type="number"
      className="form-control"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />
  </div>

  <div className="btn-group" role="group" aria-label="Basic example">
  <button type="button" className="btn btn-primary" onClick={() => recordMovement('add')}>
    Add to Inventory
  </button>
  <button type="button" className="btn btn-danger" onClick={() => recordMovement('remove')}>
    Remove from Inventory
  </button>
</div>
</div>
);
};

export default RecordMovements;
