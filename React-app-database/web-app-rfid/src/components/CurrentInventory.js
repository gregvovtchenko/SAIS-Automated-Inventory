import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

const CurrentInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/getInventoryList')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setInventory(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (productId) => {
    // Implement the logic to edit the product
    console.log('Edit product with ID:', productId);
    // You might navigate to an edit page or open a modal for editing
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`/api/deleteInventoryItem/${productId}`);
      if (response.status === 200) {
        console.log('Product deleted successfully');
        // Update the state to remove the deleted product from the list
        setInventory(inventory.filter(item => item.productID !== productId));
      } else {
        console.log('Failed to delete the product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-3">Current Inventory</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered table-sm">
              <thead className="thead-dark">
                <tr>
                  <th>ProductID</th>
                  <th>Product Name</th>
                  <th>Product Type</th>
                  <th>Supplier ID</th>
                  <th>Active Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
            {inventory.map(item => (
              <tr key={item.productID}>
                <td>{item.productID}</td>
                <td>{item.productName}</td>
                <td>{item.productType ? 'Produce' : 'Shelf Product'}</td>
                <td>{item.supplierID}</td>
                <td>{item.activeStatus ? 'Active' : 'Inactive'}</td>
                <td>{moment(item.createdAt).format('LLL')}</td>
                <td>{moment(item.updatedAt).format('LLL')}</td>
                <td>
                  <button className="btn btn-primary mr-2" onClick={() => handleEdit(item.productID)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.productID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
);
};

export default CurrentInventory;
