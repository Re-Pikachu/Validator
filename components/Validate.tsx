import React, { useState, useEffect } from 'react';
import "./Styles/Validate.css"

interface APIResponse {
  // Define the structure of the API response here
  openaiResponse: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  };
}
interface ValidateProps {
    getPosts: () => void;
  }

const Validate: React.FC<ValidateProps> = ({ getPosts }) => {
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setAPIResponse] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    getPosts()
  }, [apiResponse])
//   useEffect(() => {
//     if (apiResponse) {
//       // Create a POST request when apiResponse changes
//       const postData = {
//         prompt: inputValue,
//         response: apiResponse,
//       };

//       fetch('/your-api-endpoint', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(postData),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('API request failed');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           // Handle the response data as needed
//           getPosts()
//         })
//         .catch((error) => {
//           console.error('Error making API call:', error);
//           // Handle errors here
//         });
//     }
//   }, [apiResponse]);


  const handleAPICall = async () => {
    try {
      // Make an API call here, for example using the fetch() function
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputValue }), // Send the input value to the API
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data: APIResponse = await response.json();
      console.log(data.openaiResponse.message.content);
      setAPIResponse(data.openaiResponse.message.content);
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
        {apiResponse && <p>{apiResponse}</p>}
      </div>
    </div>
  );
};

export default Validate;
