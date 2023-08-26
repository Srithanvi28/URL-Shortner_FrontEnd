
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShortenForm.css';

const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [shortenedUrlsMap, setShortenedUrlsMap] = useState({});

  const APIurl = "http://localhost:8080/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      setIsExpired(false); 
      
      // Check if the shortened URL for this original URL is already generated
      if (shortenedUrlsMap[originalUrl]) {
        setError('URL has already been shortened.'); // Display error message
      } else {
        const response = await axios.post(APIurl + '/shorten', { url: originalUrl });
        setShortenedUrl(response.data);
        setShortenedUrlsMap(prevMap => ({ ...prevMap, [originalUrl]: response.data }));
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      setError('An error occurred while shortening the URL.');
    }
  };

  // Open the shortened URL in a new tab (if not expired)
  const handleOpenLink = () => {
    if (!isExpired) {
      window.open(shortenedUrl, '_blank');
    }
  };

  // Check if the shortened URL indicates expiration and update isExpired status
  useEffect(() => {
    if (shortenedUrl.includes("http://localhost:8080/api/") && shortenedUrl.includes("expired")) {
      setIsExpired(true);
    } else {
      setIsExpired(false);
    }
  }, [shortenedUrl]);

  return (
    <div className="shorten-form-container">
      <h2 className="form-title">URL Shortener</h2>
      <form onSubmit={handleSubmit} className="url-form">
        <label>
          Original URL:
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => {
              setOriginalUrl(e.target.value);
              setError(null); // Clear error message
            }}
            className="url-input"
          />
        </label>
        <button type="submit" className="submit-button">
          Shorten
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {shortenedUrl && (
        <div className="shortened-url-container">
          <p className="shortened-url-text">Shortened URL: {shortenedUrl}</p>
          <button
            onClick={handleOpenLink}
            className="open-link-button"
            disabled={isExpired}
          >
            {isExpired ? "Link Expired" : "Open Shortened URL"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortenForm;
