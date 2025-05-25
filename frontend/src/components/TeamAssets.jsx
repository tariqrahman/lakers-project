import { useState, useEffect } from "react";
import { API_URL } from '../config';

const TeamAssets = () => {
  const [draftPicks, setDraftPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraftPicks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/draft-picks`);
        if (!response.ok) {
          throw new Error("Failed to fetch draft picks");
        }
        const data = await response.json();
        console.log("Received data:", data);
        setDraftPicks(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDraftPicks();
  }, []);

  if (loading) return <div>Loading draft picks...</div>;
  if (error) return <div>Error: {error}</div>;

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
