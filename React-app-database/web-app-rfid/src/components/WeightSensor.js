// WeightSensor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeightSensor = () => {
  const [weight, setWeight] = useState(0);
  const [calibrationMessage, setCalibrationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial weight data, if applicable
    const fetchWeight = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/arduino-weight/getWeight');
        setWeight(response.data.weight);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching weight:', error);
        setCalibrationMessage('Error fetching weight data.');
        setIsLoading(false);
      }
    };

    fetchWeight();
  }, []);

  const calibrateWeight = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/arduino-weight/calibrateWeight');
      if (response.status === 200 && response.data.calibrated) {
        setWeight(response.data.weight);
        setCalibrationMessage('Weight calibrated successfully.');
      } else {
        setCalibrationMessage('Failed to calibrate weight.');
      }
    } catch (error) {
      console.error('Error calibrating weight:', error);
      setCalibrationMessage(`Error calibrating weight: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="weight-sensor-container">
      <h2>Weight Sensor Calibration/View</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Current Weight: {weight} kg</p>
          <button onClick={calibrateWeight} disabled={isLoading}>Calibrate Weight</button>
          {calibrationMessage && <p>{calibrationMessage}</p>}
        </>
      )}
    </div>
  );
};

export default WeightSensor;
