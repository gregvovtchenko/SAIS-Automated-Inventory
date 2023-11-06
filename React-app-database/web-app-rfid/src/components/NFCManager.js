import React, { useState } from 'react';
import axios from 'axios';

const NFCManager = () => {
  const [productName, setProductName] = useState('');
  const [productID, setProductID] = useState('');
  const [weight, setWeight] = useState('');
  const [readData, setReadData] = useState([]);
  const [message, setMessage] = useState('');
...
  const handleWrite = async () => {
    try {
      const responseESP = await axios.post('/arduino/write', {
        productName,
        productID,
        weight
      });

      if(responseESP.data.success){
        const responseBackend = await axios.post('/api/addProduct', {
          productName,
          productID: parseInt(productID),
          weight: parseInt(weight)
        });
        
        setMessage(responseBackend.data.success ? 'Data written successfully!' : 'Failed to write data to database.');
      } else {
        setMessage('Failed to write data to NFC card.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  const handleRead = async () => {
    try {
      const responseESP = await axios.get('/arduino/read');

      if (responseESP.status === 200) {
        const productID = responseESP.data.productID;
        const responseBackend = await axios.get(`/api/getProduct?productID=${productID}`);

        if(responseBackend.data.success){
          const newData = {
            productName: responseBackend.data.productName,
            productID: responseBackend.data.productID,
            weight: responseBackend.data.weight
          };

          setReadData([...readData, newData]);
          setMessage('Data read successfully!');
        } else {
          setMessage('Failed to fetch data from database.');
        }
      } else {
        setMessage('Failed to read data from NFC card.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h2>NFC Manager</h2>
      <div>
        <label>Product Name:</label>
        <input type="text" value={productName} onChange={e => setProductName(e.target.value)} />
      </div>
      <div>
        <label>Product ID:</label>
        <input type="text" value={productID} onChange={e => setProductID(e.target.value)} />
      </div>
      <div>
        <label>Weight:</label>
        <input type="text" value={weight} onChange={e => setWeight(e.target.value)} />
      </div>
      <div>
        <button onClick={handleWrite}>Write</button>
        <button onClick={handleRead}>Read</button>
      </div>
      {message && <p>{message}</p>}

      {readData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product ID</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {readData.map((data, index) => (
              <tr key={index}>
                <td>{data.productName}</td>
                <td>{data.productID}</td>
                <td>{data.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NFCManager;
