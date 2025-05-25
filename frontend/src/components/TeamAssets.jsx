import { useState, useEffect } from "react";
import { API_URL } from '../config';

const TeamAssets = () => {
  const [draftPicks, setDraftPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraftPicks = async () => {
      try {
        console.log('Fetching draft picks from:', `${API_URL}/api/draft-picks`);
        const response = await fetch(`${API_URL}/api/draft-picks`);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Failed to fetch draft picks: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        setDraftPicks(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error details:", {
          message: err.message,
          stack: err.stack,
          url: `${API_URL}/api/draft-picks`
        });
        setError(err.message);
        setLoading(false);
      }
    };

    // First try the health check
    const checkHealth = async () => {
      try {
        console.log('Checking API health at:', `${API_URL}/api/health`);
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        console.log('Health check response:', data);
        
        if (response.ok) {
          fetchDraftPicks();
        } else {
          setError('API health check failed');
          setLoading(false);
        }
      } catch (err) {
        console.error('Health check failed:', err);
        setError('Could not connect to API');
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  if (loading) return <div>Loading draft picks...</div>;
  if (error) return (
    <div className="error-container">
      <h3>Error Loading Data</h3>
      <p>{error}</p>
      <div className="technical-details">
        <p>API URL: {API_URL}</p>
        <p>Environment: {import.meta.env.MODE}</p>
        <p>Time: {new Date().toISOString()}</p>
      </div>
    </div>
  );

  console.log("Rendering with draftPicks:", draftPicks);

  return (
    <div className="team-assets">
      <h2>NBA Draft Assets</h2>
      <div className="draft-picks-grid">
        {draftPicks && draftPicks.length > 0 ? (
          draftPicks.map((teamPicks, index) => (
            <div key={index} className="team-picks-card">
              <h3>{teamPicks?.team || "Unknown Team"}</h3>
              <ul>
                {teamPicks?.picks && teamPicks.picks.map((pick, pickIndex) => (
                  <li key={pickIndex}>
                    <strong>{pick.season}:</strong>
                    <div>1st Round: {pick.firstRound || 'None'}</div>
                    <div>2nd Round: {pick.secondRound || 'None'}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div>No draft picks available</div>
        )}
      </div>
    </div>
  );
};

export default TeamAssets;
