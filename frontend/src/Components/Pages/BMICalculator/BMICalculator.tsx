import React, { useState } from 'react';
import './BMICalculator.css';

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [bmi, setBMI] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [idealWeight, setIdealWeight] = useState<string>('');

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      setBMI(parseFloat(calculatedBMI.toFixed(2)));

      // Set messages based on BMI ranges
      if (calculatedBMI < 18.5) {
        setMessage('Underweight');
      } else if (calculatedBMI < 24.9) {
        setMessage('Normal weight');
      } else if (calculatedBMI < 29.9) {
        setMessage('Overweight');
      } else {
        setMessage('Obesity');
      }

      // Set ideal weight range based on height
      const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
      const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
      setIdealWeight(`Ideal Weight: ${minWeight}kg - ${maxWeight}kg`);
    }
  };

  return (
    <div className="bmi-calculator">
      <h3>BMI Calculator</h3>
      
      <div className="bmi-grid">
        {/* Left section - BMI description */}
        <div className="bmi-description">
          <p>
            BMI (Body Mass Index) is a simple method for assessing whether you have a healthy body weight for a given height. It is calculated by dividing a person’s weight in kilograms by the square of their height in meters.
          </p>
          <p>Based on your BMI, we categorize you into one of the following ranges:</p>
          <ul>
            <li><strong>Underweight:</strong> BMI less than 18.5</li>
            <li><strong>Normal weight:</strong> BMI 18.5 - 24.9</li>
            <li><strong>Overweight:</strong> BMI 25 - 29.9</li>
            <li><strong>Obesity:</strong> BMI 30 or more</li>
          </ul>
        </div>
        
        {/* Right section - BMI calculator form */}
        <div className="bmi-form">
          <div className="input-section">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={weight ?? ''}
              onChange={(e) => setWeight(Number(e.target.value))}
            />

            <label>Height (cm)</label>
            <input
              type="number"
              value={height ?? ''}
              onChange={(e) => setHeight(Number(e.target.value))}
            />

            <button onClick={calculateBMI} className="buttonBmi">Calculate BMI</button>
          </div>

          {bmi && (
            <div className="bmi-results">
              <p>BMI: {bmi} - {message}</p>
              <p>{idealWeight}</p>
              <p>For healthy living, aim to stay in the recommended weight range.</p>
              <p><strong>Daily Water Intake:</strong> Aim for 2-3 liters of water per day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
