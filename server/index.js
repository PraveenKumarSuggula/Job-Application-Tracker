const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const keys = require("./service-account.json"); //Follow the readme and add your service account json here (Keep it secured)

const app = express();
app.use(cors());
app.use(express.json());

// Authenticate Google API
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
});

// Create a New Google Sheet
app.post("/create-sheet", async (req, res) => {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    // Create a new spreadsheet
    const response = await sheets.spreadsheets.create({
      resource: {
        properties: { title: "Job Application Tracker" },
      },
    });

    const spreadsheetId = response.data.spreadsheetId;

    // Grant Editor Permission (Anyone with link can edit)
    const drive = google.drive({ version: "v3", auth });
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: { role: "writer", type: "anyone" },
    });

    // Update Sheet with Job Application Columns
    const values = [
      ["Company Name", "Job Application Link", "Date Applied", "Current Status", "Resume Used (Drive Link)", "Uploaded Resume"],
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "A1:F1",
      valueInputOption: "RAW",
      resource: { values },
    });

    return res.json({
      success: true,
      message: "Google Sheet created and updated!",
      sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create Google Sheet." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
