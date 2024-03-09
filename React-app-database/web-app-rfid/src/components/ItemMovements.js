import React, { useState } from 'react';

const ItemMovements = () => {
  // Sample hardcoded data for item movements
  const sampleItemMovements = [
    { productId: 'P001', movementType: 'IN', quantity: 100 },
    { productId: 'P002', movementType: 'OUT', quantity: 50 },
    { productId: 'P003', movementType: 'IN', quantity: 200 },
    // Add more sample data as needed
  ];

  const [itemMovements, setItemMovements] = useState(sampleItemMovements);
  const [productId, setProductId] = useState('');
  const [movementType, setMovementType] = useState('');
  const [quantity, setQuantity] = useState('');

  // Simulate recording a new item movement
  const handleRecordMovement = () => {
    const newItemMovement = { productId, movementType, quantity };
    setItemMovements([...itemMovements, newItemMovement]);

    // Clear input fields
    setProductId('');
    setMovementType('');
    setQuantity('');
  };

  return (
    <div>
      <h1>Item Movements</h1>
      <div>
        <input 
          type="text" 
          value={productId} 
          onChange={(e) => setProductId(e.target.value)} 
          placeholder="Product ID" 
        />
        <input 
          type="text" 
          value={movementType} 
          onChange={(e) => setMovementType(e.target.value)} 
          placeholder="Movement Type" 
        />
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          placeholder="Quantity" 
        />
        <button onClick={handleRecordMovement}>Record Movement</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Supplier ID</th>
            <th>Type</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {itemMovements.map((movement, index) => (
            <tr key={index}>
              <td>{movement.productId}</td>
              <td></td>
              <td>{movement.movementType}</td>
              <td>{movement.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemMovements;
