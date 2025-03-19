import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  TextField,
  Select,
  MenuItem,
  Tooltip,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import "../assets/styles.css";

const statuses = ["Applied", "Interview", "Offer", "Rejected", "Accepted"];

const JobTable = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [editingStatusDate, setEditingStatusDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedRowId, setSelectedRowId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [openRowDialog, setOpenRowDialog] = useState(false);

  const [selectedRowIdToDelete, setSelectedRowIdToDelete] = useState(null);

  const handleOpenDialog = (id, status) => {
    setSelectedRowId(id);
    setSelectedStatus(status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenRowDialog = (id) => {
    setSelectedRowIdToDelete(id);

    setOpenRowDialog(true);
  };

  const handleCloseRowDialog = () => {
    setOpenRowDialog(false);
  };

  const deleteStatusHistory = async (id, statusKey) => {
    try {
      const jobRef = doc(db, `users/${auth.currentUser.uid}/jobs`, id);

      let jobData = rows.find((row) => row.id === id);

      if (!jobData || !jobData.statusDates || !jobData.statusDates[statusKey])
        return;

      let updatedStatusDates = { ...jobData.statusDates };

      delete updatedStatusDates[statusKey]; // Remove selected status

      await updateDoc(jobRef, { statusDates: updatedStatusDates });

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, statusDates: updatedStatusDates } : row
        )
      );

      setOpenDialog(false); // Close dialog after deletion
    } catch (error) {
      console.error("❌ Firestore Delete Error:", error);
    }
  };

  // Fetch data from Firestore
  useEffect(() => {
    if (auth.currentUser) {
      const jobsRef = collection(db, `users/${auth.currentUser.uid}/jobs`);

      return onSnapshot(jobsRef, (snapshot) => {
        const jobs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dateApplied: data.dateApplied ? dayjs(data.dateApplied) : null,
            lastUpdated: data.lastUpdated ? dayjs(data.lastUpdated) : null,
          };
        });

        setRows(jobs);
        setIsLoading(false);
      });
    }
  }, []);

  // Handle Firestore updates (with Last Updated timestamp)
  const updateField = async (id, field, value, statusKey = null) => {
    try {
      const jobRef = doc(db, `users/${auth.currentUser.uid}/jobs`, id);
      let jobData = rows.find((row) => row.id === id);

      let updatedData = { lastUpdated: dayjs().format() };

      // Updating only the selected status date
      if (field === "statusDates" && statusKey) {
        updatedData.statusDates = {
          ...jobData.statusDates,
          [statusKey]: value,
        };
      } else {
        updatedData[field] = value;
      }

      await updateDoc(jobRef, updatedData);

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, ...updatedData } : row
        )
      );

      setEditingCell(null);
    } catch (error) {
      console.error("Firestore Update Error:", error);
    }
  };

  // Handle input exit (submit changes only on blur or enter)
  const handleInputBlur = (id, field) => {
    updateField(id, field, tempValue);
  };

  // Handle Enter key press to submit
  const handleKeyDown = (e, id, field) => {
    if (e.key === "Enter") {
      updateField(id, field, tempValue);
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (event, id) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];
      await updateField(id, "resumeBase64", base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleResumePreview = (resumeBase64) => {
    if (!resumeBase64) return;

    // Ensure we remove the prefix before decoding
    const base64Data = resumeBase64.split(",")[1];

    if (!base64Data) {
      console.error("Invalid Base64 format.");
      return;
    }

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Base64 decoding error:", error);
    }
  };

  // Handle resume download
  const handleResumeDownload = (resumeBase64) => {
    if (!resumeBase64) return;

    // Remove prefix
    const base64Data = resumeBase64.split(",")[1];

    if (!base64Data) {
      console.error("Invalid Base64 format.");
      return;
    }

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Base64 decoding error:", error);
    }
  };

  // Handle row deletion
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/jobs`, id));

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));

      setOpenRowDialog(false); // Close dialog after deletion
    } catch (error) {
      console.error("❌ Firestore Delete Error:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="table-wrapper">
        <Stack direction="column" spacing={3}>
          {isLoading ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="job applications">
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell sx={{ minWidth: 200 }} className="table-th">
                      Company
                    </TableCell>
                    <TableCell sx={{ minWidth: 150 }} className="table-th">
                      Job Details
                    </TableCell>
                    <TableCell sx={{ minWidth: 100 }} className="table-th">
                      Current Status
                    </TableCell>
                    <TableCell className="table-th">Status History</TableCell>
                    <TableCell sx={{ minWidth: 100 }} className="table-th">
                      Resume Used
                    </TableCell>
                    <TableCell sx={{ minWidth: 50 }} className="table-th">
                      Last Updated
                    </TableCell>
                    <TableCell className="table-th">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {/* Company */}
                      <TableCell
                        onClick={() => {
                          setEditingCell({ id: row.id, field: "company" });
                          setTempValue(row.company);
                        }}
                      >
                        {editingCell?.id === row.id &&
                        editingCell?.field === "company" ? (
                          <TextField
                            variant="outlined"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => handleInputBlur(row.id, "company")}
                            onKeyDown={(e) =>
                              handleKeyDown(e, row.id, "company")
                            }
                            autoFocus
                            className="custom-textbox"
                          />
                        ) : (
                          row.company || "N/A"
                        )}
                      </TableCell>

                      {/* Job Details */}
                      <TableCell
                        onClick={() => {
                          setEditingCell({ id: row.id, field: "joblink" });
                          setTempValue(row.joblink || "");
                        }}
                      >
                        {editingCell?.id === row.id &&
                        editingCell?.field === "joblink" ? (
                          <TextField
                            variant="outlined"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => handleInputBlur(row.id, "joblink")}
                            onKeyDown={(e) =>
                              handleKeyDown(e, row.id, "joblink")
                            }
                            autoFocus
                            className="custom-textbox"
                          />
                        ) : (
                          row.joblink || "N/A"
                        )}
                      </TableCell>

                      {/* Current Status */}
                      <TableCell>
                        {editingCell?.id === row.id &&
                        editingCell?.field === "status" ? (
                          <Select
                            value={
                              Array.isArray(row.status)
                                ? row.status[0]
                                : row.status || ""
                            }
                            onChange={(e) =>
                              updateField(row.id, "status", e.target.value)
                            }
                            autoFocus
                          >
                            {statuses.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <span
                            onClick={() =>
                              setEditingCell({ id: row.id, field: "status" })
                            }
                          >
                            <Typography>
                              {Array.isArray(row.status)
                                ? row.status[0]
                                : row.status || "N/A"}
                            </Typography>
                          </span>
                        )}
                      </TableCell>

                      {/* Status History */}
                      <TableCell>
                        {row.statusDates &&
                        Object.keys(row.statusDates).length > 0
                          ? Object.entries(row.statusDates)
                              .sort((a, b) =>
                                dayjs(a[1]).isAfter(dayjs(b[1])) ? 1 : -1
                              )
                              .map(([status, date]) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  key={status}
                                  alignItems="center"
                                  padding={0.3}
                                >
                                  {editingStatusDate?.id === row.id &&
                                  editingStatusDate?.status === status ? (
                                    <LocalizationProvider
                                      dateAdapter={AdapterDayjs}
                                    >
                                      <DatePicker
                                        value={dayjs(date)}
                                        onChange={(newDate) => {
                                          updateField(
                                            row.id,
                                            "statusDates",
                                            dayjs(newDate).format("YYYY-MM-DD"),
                                            status
                                          );
                                          setEditingStatusDate(null);
                                        }}
                                        format="YYYY-MM-DD"
                                        open
                                        onClose={() =>
                                          setEditingStatusDate(null)
                                        }
                                        slotProps={{
                                          textField: {
                                            size: "small",
                                            variant: "outlined",
                                          },
                                        }}
                                        sx={{
                                          backgroundColor: "white",
                                          borderRadius: "5px",
                                        }}
                                      />
                                    </LocalizationProvider>
                                  ) : (
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          display: "inline-flex",

                                          justifyContent: "center",

                                          alignItems: "center",

                                          width: "180px",

                                          height: "35px",

                                          borderRadius: "6px",

                                          backgroundColor:
                                            status === "Applied"
                                              ? "#d9d9d9"
                                              : status === "Interview"
                                              ? "#cce5ff"
                                              : status === "Offer"
                                              ? "#d4edda"
                                              : status === "Rejected"
                                              ? "#f8d7da"
                                              : "#e2d9f3",

                                          textAlign: "center",

                                          cursor: "pointer",

                                          border:
                                            "1px solid rgba(0, 0, 0, 0.2)",
                                        }}
                                        onClick={() =>
                                          setEditingStatusDate({
                                            id: row.id,

                                            status,
                                          })
                                        }
                                      >
                                        {status} (
                                        {dayjs(date).format("MMM D, YYYY")})
                                      </Typography>

                                      {/* Red "X" Button for Deleting Status */}

                                      <Tooltip title="Delete Status">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleOpenDialog(row.id, status)
                                          }
                                          sx={{ color: "red" }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  )}
                                </Stack>
                              ))
                          : "N/A"}
                      </TableCell>

                      {/* Confirmation Dialog for Deleting Status */}

                      <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Confirm Delete</DialogTitle>

                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the status{" "}
                            <strong>{selectedStatus}</strong>?
                          </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                          <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                          </Button>

                          <Button
                            onClick={() =>
                              deleteStatusHistory(selectedRowId, selectedStatus)
                            }
                            color="error"
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>

                      {/* Resume Used */}
                      <TableCell>
                        {row.resumeBase64 ? (
                          <>
                            <Tooltip title="Preview Resume">
                              <IconButton
                                onClick={() =>
                                  handleResumePreview(row.resumeBase64)
                                }
                                sx={{ color: "var(--primary-color)" }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Resume">
                              <IconButton
                                onClick={() =>
                                  handleResumeDownload(row.resumeBase64)
                                }
                                sx={{ color: "var(--primary-color)" }}
                              >
                                <GetAppIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Upload Resume">
                            <IconButton component="label">
                              <CloudUploadIcon />
                              <Input
                                type="file"
                                hidden
                                accept=".pdf"
                                onChange={(event) =>
                                  handleResumeUpload(event, row.id)
                                }
                                sx={{ color: "var(--primary-color)" }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>

                      {/* Last Updated */}
                      <TableCell>
                        {row.lastUpdated
                          ? dayjs(row.lastUpdated).format("MMM D, YYYY h:mm A")
                          : "N/A"}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                       

                        <Tooltip title="Delete Job Entry">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenRowDialog(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        </Tooltip>
                      </TableCell>

                      {/* Confirmation Dialog for Deleting Row */}

                      <Dialog
                        open={openRowDialog}
                        onClose={handleCloseRowDialog}
                      >
                        <DialogTitle>Confirm Delete</DialogTitle>

                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete this job entry?
                          </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                          <Button
                            onClick={handleCloseRowDialog}
                            color="primary"
                          >
                            Cancel
                          </Button>

                          <Button
                            onClick={() => handleDelete(selectedRowIdToDelete)}
                            color="error"
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </div>
    </LocalizationProvider>
  );
};

export default JobTable;
