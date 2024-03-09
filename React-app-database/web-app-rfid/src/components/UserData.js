import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios with npm or yarn

function UserData() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Replace with the actual API endpoint to fetch user data
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the user data:', error);
      });
  }, []);

  return (
    <div>
      <h2>User Data</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact Details</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.contactDetails}</td>
              <td>{user.role}</td>
              <td>{/* Render user actions or provide links to view more details */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserData;
