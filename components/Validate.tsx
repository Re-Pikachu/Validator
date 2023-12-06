import React, { useState } from 'react';
import "./Styles/Validate.css"

interface APIResponse {
  // Define the structure of the API response here
  message: string;
}

const Validate: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setAPIResponse] = useState<APIResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAPICall = async () => {
    try {
      // Make an API call here, for example using the fetch() function
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST', // or 'GET' or any other HTTP method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputValue }), // Send the input value to the API
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: APIResponse = await response.json();
      setAPIResponse(data);
    } catch (error) {
      console.error('Error making API call:', error);
      // Handle errors here
    }
  };

  return (
    <div className="main-content">
      <div className="input-box">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter something..."
        />
        <button onClick={handleAPICall}>Validate Me!</button>
      </div>
      <div className="response-area">
        {apiResponse && <p>{apiResponse.message}</p>}
      </div>
    </div>
  );
};

export default Validate;
