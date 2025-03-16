import React, { useState } from "react";
import axios from "axios";

const GoogleSheetUploader = () => {
  const [loading, setLoading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");

  // Create Google Sheet via API
  const handleCreateSheet = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/create-sheet");
      setSheetUrl(response.data.sheetUrl);
      alert("Google Sheet created! You can now access it.");
    } catch (error) {
      console.error(error);
      alert("Failed to create Google Sheet.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Google Sheets Job Tracker</h2>

      {/* Create Google Sheet Button */}
      <button onClick={handleCreateSheet} disabled={loading}>
        {loading ? "Creating..." : "Create Google Sheet"}
      </button>

      {/* Display Sheet Link */}
      {sheetUrl && (
        <p>
          ✅ Your Google Sheet: <a href={sheetUrl} target="_blank" rel="noopener noreferrer">{sheetUrl}</a>
        </p>
      )}
    </div>
  );
};

export default GoogleSheetUploader;
