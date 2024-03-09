import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductRegistration = () => {
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState(0); // Assuming 0 as default
  const [supplierID, setSupplierID] = useState('');
  const [activeStatus, setActiveStatus] = useState(0); // Assuming 0 as default
  const [suppliers, setSuppliers] = useState([]);

  // Supplier states
  const [supplierName, setSupplierName] = useState('');
  const [contactDetails, setContactDetails] = useState('');

  // Common state
  const [message, setMessage] = useState('');
  const [readData, setReadData] = useState([]);
  const [inventory, setInventory] = useState([]);


  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('/api/getSuppliers');
        setSuppliers(response.data || []);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setTimeout(() => setMessage(''), 5000);
        // Handle error, e.g., set an error message in state
      }
    };
  
    fetchSuppliers();
  }, []);
  



  const handleWrite = async () => {
    try {
      // Send data to Node.js backend to store in the database
      const responseBackend = await axios.post('/api/addItemToInventory', {
        productName,
        productType,
        supplierID,
        activeStatus
      });
  
      if (responseBackend.status === 200) {
        const newProductID = responseBackend.data.productID; // Assuming the backend returns productID
        console.log('ProductID received from backend: ' + newProductID);
  
        // Send data to Arduino with the new productID
        try {
          const responseESP = await axios.post('/arduino/write', {
            productID: newProductID,
            productName,
            productType,
            supplierID,
            activeStatus
          });
  
          if (responseESP.status === 200) {
            console.log('Data written to NFC card: ' + JSON.stringify(responseESP.data));
            setMessage('Product registered successfully.');
          } else {
            setMessage('Failed to write data to NFC card.');
          }
        } catch (error) {
          setMessage('Error writing to NFC card: ' + error.message);
        }
      } else {
        setMessage('Failed to add product to inventory.');
      }
    } catch (error) {
      setMessage('Error adding product to inventory: ' + error.message);
    }
  };
  
  

  const handleRead = async () => {
    try {
      // Read the productID from the NFC card
      const responseNFC = await axios.get('/arduino/read');
  
      if (responseNFC.status === 200 && responseNFC.data.productID) {
        const productID = responseNFC.data.productID;
        setMessage(`Product ID fetched from NFC card: ${productID}`);
        console.log(`ProductID received from NFC card: ${productID}`);
  
        // Fetch product details from the database using the productID
        try {
          // Corrected template literal syntax
          const responseBackend = await axios.get(`/api/getProductById/${productID}`);
  
          if (responseBackend.status === 200 && responseBackend.data.success) {
            const productData = responseBackend.data.data;
  
            setReadData([...readData, {
              productID: productData.productID,
              productName: productData.productName,
              productType: productData.productType,
              supplierID: productData.supplierID,
              activeStatus: productData.activeStatus,
            }]);
            setMessage('Product data fetched successfully from the database.');
          } else {
            setMessage('Failed to fetch product data from the database.');
          }
        } catch (err) {
          setMessage(`Error fetching data from database: ${err.message}`);
        }
      } else {
        setMessage('Failed to read product ID from NFC card.');
      }
    } catch (err) {
      setMessage(`Error reading from NFC card: ${err.message}`);
    }
  };
  
  
  

  const handleRegisterSupplier = async () => {
    try {
      const response = await axios.post('/api/addSupplier', {
        supplierName,
        contactDetails,
      });

      if (response.status === 200) {
        setMessage('Supplier registered successfully.');
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Failed to register supplier.');
        setTimeout(() => setMessage(''), 5000);
      }
      if (response.status === 409) {
        setMessage('Supplier already exists.');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage(`Error registering supplier, probably supplier already exists.`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDeleteSupplier = async (supplierID) => {
    try {
      const response = await axios.delete(`/api/deleteSupplier/${supplierID}`);
      if (response.status === 200) {
        setMessage('Supplier deleted successfully.');
        setInventory(inventory.filter(item => item.supplierID !== supplierID));
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Failed to delete supplier.');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage('Error deleting supplier: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    }
  }

  const displaySuppliers = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Contact Details</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.supplierID}>
              <td>{supplier.supplierID}</td>
              <td>{supplier.supplierName}</td>
              <td>{supplier.contactDetails}</td>
              <td>
                <button onClick={() => handleDeleteSupplier(supplier.supplierID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  const displayData = (data) => {
    return (
      <div>
        <p>Product ID: {data.productID}</p>
        <p>Product Name: {data.productName}</p>
        <p>Product Type: {data.productType}</p>
        <p>Supplier ID: {data.supplierID}</p>
        <p>Active Status: {data.activeStatus}</p>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="nfc-manager">
        <h2>NFC Manager</h2>
        {/* Supplier registration form */}
        <div>
          <h3>Register Supplier</h3>
          <div>
            <label>Supplier Name:</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>
          <div>
            <label>Contact Details:</label>
            <textarea
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
            />
          </div>
          <button onClick={handleRegisterSupplier}>Register Supplier</button>
        </div>
        {/* Product registration form */}
        <div>
          <label>Product Name:</label>
          <input type="text" value={productName} onChange={e => setProductName(e.target.value)} />
        </div>
        <div>
          <label>Product Type:</label>
          <select value={productType} onChange={e => setProductType(e.target.value)}>
            <option value="0">Produce</option>
            <option value="1">Shelf Product</option>
          </select>
        </div>
        <div>
          <label>Supplier ID:</label>
          <select value={supplierID} onChange={(e) => setSupplierID(e.target.value)}>
            {suppliers.map((supplier) => (
              <option key={supplier.supplierID} value={supplier.supplierID}>
                {supplier.supplierName} (ID: {supplier.supplierID})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Active Status:</label>
          <select value={activeStatus} onChange={e => setActiveStatus(e.target.value)}>
            <option value="0">Inactive</option>
            <option value="1">Active</option>
          </select>
        </div>
        <div>
          <button onClick={handleWrite}>Register Product</button>
          <button onClick={handleRead}>Get Product Data</button>
        </div>
        <div>
          {displayData(readData)}
        </div>
        {message && <p>{message}</p>}
    
        {readData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Supplier ID</th>
                <th>Active Status</th>
              </tr>
            </thead>
            <tbody>
              {readData.map((data, index) => (
                <tr key={index}>
                  <td>{data.productID}</td>
                  <td>{data.productName}</td>
                  <td>{data.productType === 1 ? 'Shelf Product' : 'Produce'}</td>
                  <td>{data.supplierID}</td>
                  <td>{data.activeStatus === 1 ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="registered-suppliers">
        <h3>Registered Suppliers</h3>
        {displaySuppliers()}
      </div>
    </div> 
  );
}  

export default ProductRegistration;
  