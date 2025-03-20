import React, { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { Button, Typography, Input } from "@mui/material";
import { parse } from "papaparse";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import "../assets/styles.css"; // ✅ Import updated styles

const CsvHandler = () => {
  const [uploading, setUploading] = useState(false);

  // 📌 Upload CSV Function (Includes All Columns)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = parse(target.result, { header: true });
      const jobData = csv.data.filter((row) => row.company && row.status);

      try {
        const userJobsRef = collection(db, `users/${auth.currentUser.uid}/jobs`);
        for (let job of jobData) {
          await addDoc(userJobsRef, {
            company: job.company || "N/A",
            jobDetails: job.jobDetails || "N/A",
            status: job.status || "Applied",
            statusDates: job.statusDates ? JSON.parse(job.statusDates) : {}, // Convert JSON string to object
            resumeUsed: job.resumeUsed || "",
            lastUpdated: job.lastUpdated || new Date().toISOString(),
          });
        }
        alert("CSV uploaded successfully!");
      } catch (error) {
        console.error("CSV Upload Error:", error);
      }

      setUploading(false);
    };
    reader.readAsText(file);
  };

  // 📌 Download CSV Function (Includes All Columns)
  const handleDownloadCSV = async () => {
    const userJobsRef = collection(db, `users/${auth.currentUser.uid}/jobs`);
    const snapshot = await getDocs(userJobsRef);
    const jobs = snapshot.docs.map((doc) => doc.data());

    if (jobs.length === 0) {
      alert("No job applications found.");
      return;
    }

    const csvRows = [];
    csvRows.push("Company,Job Details,Status,Status History,Resume Used,Last Updated");

    jobs.forEach((job) => {
      const statusHistory = job.statusDates ? JSON.stringify(job.statusDates) : "{}";
      const row = [
        `"${job.company}"`,
        `"${job.jobDetails}"`,
        `"${job.status}"`,
        `"${statusHistory}"`,
        `"${job.resumeUsed}"`,
        `"${job.lastUpdated}"`,
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "job_applications.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="csv-container">
      {/* Upload CSV (Left Side) */}
      <Button variant="contained" component="label" className="csv-button csv-upload" startIcon={<FileUploadIcon />}>
        {uploading ? "Uploading..." : "Upload CSV"}
        <Input type="file" hidden accept=".csv" onChange={handleFileUpload} />
      </Button>

      {/* Download CSV (Right Side) */}
      <Button variant="contained" className="csv-button csv-download" startIcon={<DownloadIcon />} onClick={handleDownloadCSV}>
        Download CSV
      </Button>
    </div>
  );
};

export default CsvHandler;
