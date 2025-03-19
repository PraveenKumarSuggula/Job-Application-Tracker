import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Link,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs from "dayjs";

const statuses = ["Applied", "Interview", "Offer", "Rejected", "Accepted"];

const JobForm = () => {
  const [company, setCompany] = useState("");
  const [joblink, setJobLink] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [statusDates, setStatusDates] = useState({});
  const [resumeBase64, setResumeBase64] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumePreviewURL, setResumePreviewURL] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  // Handle file upload
  const handleFileChange = (file) => {
    if (!file) return;

    // Ensure the file is a PDF
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    // Generate new file name concatenated with company name
    const newFileName = company
      ? `${company.replace(/\s+/g, "_")}_${file.name}`
      : file.name;

    setResumeFileName(newFileName);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setResumeBase64(base64String);
      setResumePreviewURL(URL.createObjectURL(file)); // Create a preview link
    };
    reader.readAsDataURL(file);
  };

  // Handle status selection
  const handleStatusChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStatuses(value);

    const newStatusDates = { ...statusDates };
    value.forEach((status) => {
      if (!newStatusDates[status]) {
        newStatusDates[status] = null;
      }
    });

    Object.keys(newStatusDates).forEach((status) => {
      if (!value.includes(status)) {
        delete newStatusDates[status];
      }
    });

    setStatusDates(newStatusDates);
  };

  // Handle date change for each status
  const handleStatusDateChange = (status, date) => {
    setStatusDates((prevDates) => ({
      ...prevDates,
      [status]: date ? dayjs(date).format("YYYY-MM-DD") : null,
    }));
  };

  // Form validation before submission
  const validateForm = () => {
    const newErrors = {};
    if (!company.trim()) newErrors.company = "Company name is required.";
    if (selectedStatuses.length === 0)
      newErrors.status = "At least one status must be selected.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/jobs`), {
        company,
        joblink,
        status: selectedStatuses,
        statusDates,
        resumeBase64,
        resumeFileName, // Save the renamed resume file name
        notes,
        createdAt: serverTimestamp(),
      });

      alert("Application added successfully!");

      // Reset form fields
      setCompany("");
      setJobLink("");
      setSelectedStatuses([]);
      setStatusDates({});
      setResumeBase64("");
      setResumeFileName("");
      setResumePreviewURL("");
      setNotes("");
      setErrors({});
    } catch (err) {
      console.error("Firestore Error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Job Application
      </Typography>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        {/* Company Name */}
        <TextField
          label="Company"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          error={!!errors.company}
          helperText={errors.company}
        />

        {/* Job Link */}
        <TextField
          label="Job Link"
          value={joblink}
          onChange={(e) => setJobLink(e.target.value)}
        />

        {/* Status Selection */}
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={selectedStatuses}
            onChange={handleStatusChange}
            input={<OutlinedInput label="Status" />}
            renderValue={(selected) => selected.join(", ")}
            error={!!errors.status}
          >
            {statuses.map((statusOption) => (
              <MenuItem key={statusOption} value={statusOption}>
                <Checkbox
                  checked={selectedStatuses.indexOf(statusOption) > -1}
                />
                <ListItemText primary={statusOption} />
              </MenuItem>
            ))}
          </Select>
          {errors.status && (
            <Typography variant="caption" color="error">
              {errors.status}
            </Typography>
          )}
        </FormControl>

        {/* Status Dates */}
        {selectedStatuses.map((status) => (
          <DatePicker
            key={status}
            label={`${status} Date`}
            value={statusDates[status] ? dayjs(statusDates[status]) : null}
            onChange={(date) => handleStatusDateChange(status, date)}
            format="YYYY-MM-DD"
          />
        ))}

        {/* Resume Upload */}
        <Stack direction="column" spacing={2}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              color: "var(--primary-color)",
              border: "1px solid var(--primary-color)",
            }}
          >
            Upload Resume
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </Button>

          {/* Show Uploaded Resume Name */}
          {resumeFileName && (
            <Typography variant="body2" color="textSecondary">
              <strong>Uploaded Resume:</strong> {resumeFileName}
            </Typography>
          )}

          {/* Resume Preview Link */}
          {resumePreviewURL && (
            <Link
              href={resumePreviewURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Uploaded Resume
            </Link>
          )}
        </Stack>

        {/* Additional Notes */}
        <TextField
          label="Additional Notes"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          type="submit"
          sx={{
            background: "var(--primary-color)",
            border: "1px solid var(--primary-color)",
          }}
        >
          Submit
        </Button>
      </Stack>
    </Container>
  );
};

export default JobForm;
