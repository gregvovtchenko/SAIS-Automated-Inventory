// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css'; // Import the CSS file
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your components
import UserData from './components/UserData';
// import InventoryManagement from './components/InventoryManagement';
import CurrentInventory from './components/CurrentInventory';
import ItemMovements from './components/ItemMovements';
import ProductRegistration from './components/ProductRegistration';
import RecordMovements from './components/RecordMovements';
import WeightSensor from './components/WeightSensor';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  // State to manage menu visibility on mobile
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [arrowDirection, setArrowDirection] = useState('↓'); // Default arrow pointing down

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    setArrowDirection(isMenuVisible ? '↓' : '↑');
  };

  return (
    <Router>
      <div className="App d-flex">
        <aside className={`App-header d-flex flex-column col-md-3 ${isMenuVisible ? 'active' : ''}`}>
          <h1 className="h3 mb-3">Inventory Management System</h1>
          <div className="hamburger" onClick={toggleMenu}>&#9776;</div>
            <div className={`arrow ${isMenuVisible ? 'up-arrow' : 'down-arrow'}`}></div>
          <nav className="nav flex-column mb-auto">
            <NavLink to="/user-data" className="nav-link text-white" activeClassName="active">User Data</NavLink>
            {/* <NavLink to="/inventory-management" className="nav-link text-white" activeClassName="active">Inventory Management</NavLink> */}
            <NavLink to="/current-inventory" className="nav-link text-white" activeClassName="active">Current Inventory</NavLink>
            <NavLink to="/item-movements" className="nav-link text-white" activeClassName="active">Item Movements</NavLink>
            <NavLink to="/product-registration" className="nav-link text-white" activeClassName="active">Product Registration</NavLink>
            <NavLink to="/record-movements" className="nav-link text-white" activeClassName="active">Record Movements</NavLink>
            <NavLink to="/weight-sensor" className="nav-link text-white" activeClassName="active">Weight Sensor</NavLink>
            <NavLink to="/login" className="nav-link text-white" activeClassName="active">Login</NavLink>
          </nav>
        </aside>
        <main className="col-md-9">
          <div className="main-content p-4 bg-white rounded shadow-sm">
            <Routes>
              <Route path="/user-data" element={<UserData />} />
              {/* <Route path="/inventory-management" element={<InventoryManagement />} /> */}
              <Route path="/current-inventory" element={<CurrentInventory />} />
              <Route path="/item-movements" element={<ItemMovements />} />
              <Route path="/product-registration" element={<ProductRegistration />} />
              <Route path="/record-movements" element={<RecordMovements />} />
              <Route path="/weight-sensor" element={<WeightSensor />} />
              <Route path="/" element={<ProductRegistration />} />
              <Route path ="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; 2023 Inventory Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
