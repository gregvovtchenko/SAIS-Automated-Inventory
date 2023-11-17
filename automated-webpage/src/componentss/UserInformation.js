import React from 'react';

function UserInformation() {
  return (
    <>
      {/* First Grid: User Information / User Menu */}
      <div className="w3-row">
        <div className="w3-half w3-black w3-container w3-center" style={{ height: '700px' }}>
          <div className="w3-padding-64">
            <h1>NFC Manager: Automated Inventory</h1>
          </div>
          <div className="w3-padding-64">
            <a href="#" className="w3-button w3-black w3-block w3-hover-blue-grey w3-padding-16">View User Data</a>
            <a href="#work" className="w3-button w3-black w3-block w3-hover-teal w3-padding-16">Read/Write Inventory</a>
            <a href="#work" className="w3-button w3-black w3-block w3-hover-dark-grey w3-padding-16">View Current Inventory</a>
            <a href="#contact" className="w3-button w3-black w3-block w3-hover-brown w3-padding-16">Swing By</a>
          </div>
        </div>
        <div className="w3-half w3-blue-grey w3-container" style={{ height: '700px' }}>
          <div className="w3-padding-64 w3-center">
            <h1>User Data</h1>
            <img src="/w3images/avatar3.png" className="w3-margin w3-circle" alt="Person" style={{ width: '50%' }} />
            <div className="w3-left-align w3-padding-large">
              <p>The User's Data, Date, And access to settings and editing profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Grid: Read and Work Data / Showing Current Inventory */}
      <div className="w3-row">
        <div className="w3-half w3-light-grey w3-center" style={{ minHeight: '800px' }} id="work">
          <div style={{ backgroundColor: 'MediumSeaGreen' }} className="w3-padding-64">
            <h2>Read / Write Inventory</h2>
            <p>Some of my latest projects.</p>
          </div>
          <div style={{ backgroundColor: 'MediumSeaGreen' }} className="w3-row">
            <h1>Write Value</h1>
            <label htmlFor="username">Product Name</label><br />
            <input type="text" id="username" name="username" /><br />
            <label htmlFor="pwd">Product type: Q or W</label><br />
            <input type="password" id="pwd" name="pwd" /><br /><br />
            <input type="submit" value="Submit" />
            <p>Shows if successful or not</p>
          </div>

          <div style={{ backgroundColor: 'DodgerBlue' }} className="w3-row">
            <h1>Read Data</h1>
            <table className="w3-table">
              <tr>
                <th>Product ID</th>
                <th>Product name</th>
                <th>Product Quantity or Weight (Q or W)</th>
                <th>Measurement</th>
              </tr>
              <tr>
                <td>1010</td>
                <td>Bananas</td>
                <td>W</td>
                <td>Weight: 35 g</td>
              </tr>
              <p>Waiting for More Entries...</p>
            </table>
          </div>
        </div>

        <div className="w3-half w3-indigo w3-container" style={{ minHeight: '800px' }}>
          <div className="w3-padding-64 w3-center">
            <h2>Current Inventory</h2>
            <p>For: "Current Date"</p>
            <div className="w3-container w3-responsive">
                    <table class="w3-table">
                <tr>
                    <th>Product ID</th>
                    <th>Product name</th>
                    <th>Product Quantity or Weight (Q or W)</th>
                    <th>Measurement</th>
                </tr>
                <tr class="w3-white">
                    <td>1010</td>
                    <td>Bananas</td>
                    <td>W</td>
                    <td>Weight: 35 g</td>
                </tr>
                
                    <td>1010</td>
                    <td>Bananas</td>
                    <td>Q</td>
                    <td>Weight: 35 g</td>
            
                <tr class="w3-white">
                    <td>5006</td>
                    <td>Milk</td>
                    <td>Q</td>
                    <td>Quantity: 26</td>
                </tr>
                
                </table>
            </div>
          </div>
        </div>
      </div>

      {/* Third Grid: Graphs and Trends / Recipes */}
      <div className="w3-row" id="contact">
        <div className="w3-half w3-dark-grey w3-container w3-center" style={{ height: '700px' }}>
          <div className="w3-padding-64">
            <h1>Graphs and Trends</h1>
            <p>This is where all of the charts and trends will be located</p>
          </div>
        </div>

        <div className="w3-half w3-teal w3-container" style={{ height: '700px' }}>
          <div className="w3-padding-64 w3-padding-large">
            <h1>Recipes</h1>
            <p className="w3-opacity">What can be bought</p>
            <p>dananan</p>
            <p className="w3-opacity">What cannot be bought</p>
            <p>dananan</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w3-container w3-black w3-padding-16">
        <p>Made By: Automated Inventory Productions</p>
      </footer>
    </>
  );
}

export default UserInformation;
