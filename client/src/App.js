import React from "react";
import GoogleSheetUploader from "./components/GoogleSheetUploader";
import "./styles.css";

function App() {
  return (
    <div>
      <h1>Job Application Tracker</h1>
      <GoogleSheetUploader />
    </div>
  );
}

export default App;
