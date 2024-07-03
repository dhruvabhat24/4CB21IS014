
import React, { useState, useEffect } from 'react';

const AverageCalculator = () => {
  const [numberType, setNumberType] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [windowSize, setWindowSize] = useState(5); // Default window size
  const [average, setAverage] = useState(null);
  const [beforeNumbers, setBeforeNumbers] = useState([]);
  const [afterNumbers, setAfterNumbers] = useState([]);

  // Function to fetch number from the third-party API
  const fetchNumber = async (type) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 500);

      const response = await fetch(`https://example.com/api/${type}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Network response was not ok');
      const number = await response.json();

      if (!numbers.includes(number)) {
        setBeforeNumbers([...numbers]);

        if (numbers.length >= windowSize) {
          setNumbers((prev) => [...prev.slice(1), number]);
        } else {
          setNumbers((prev) => [...prev, number]);
        }

        setAfterNumbers((prev) => [...prev.slice(1), number]);
      }
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };

  useEffect(() => {
    if (numbers.length) {
      const sum = numbers.reduce((acc, num) => acc + num, 0);
      setAverage(sum / numbers.length);
    }
  }, [numbers]);

  return (
    <div>
      <h1>Average Calculator</h1>
      <div>
        <label>
          Number Type:
          <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>
            <option value="">Select</option>
            <option value="p">Prime</option>
            <option value="f">Fibonacci</option>
            <option value="e">Even</option>
            <option value="r">Random</option>
          </select>
        </label>
        <button onClick={() => fetchNumber(numberType)}>Fetch Number</button>
      </div>
      <div>
        <h2>Stored Numbers</h2>
        <p>Before: {beforeNumbers.join(', ')}</p>
        <p>After: {afterNumbers.join(', ')}</p>
      </div>
      <div>
        <h2>Average</h2>
        {average !== null ? <p>{average}</p> : <p>No numbers to average</p>}
      </div>
    </div>
  );
};

export default AverageCalculator;
