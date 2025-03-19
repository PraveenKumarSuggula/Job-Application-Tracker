import React, { useEffect, useState, useRef } from "react";
import { collection, doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import "ag-grid-community/styles/ag-grid.css";
import "../assets/styles.css"; // ✅ Import styles

// ✅ Register AG Grid Modules
ModuleRegistry.registerModules([ClientSideRowModelModule, AllEnterpriseModule]);

const statuses = ["Applied", "Interview", "Offer", "Rejected", "Accepted"];

const StatusCellRenderer = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(props.value);

    const handleEditClick = () => setIsEditing(true);

    const handleSaveClick = async () => {
        if (selectedStatus === props.value) {
            setIsEditing(false);
            return;
        }

        const jobRef = doc(db, `users/${auth.currentUser.uid}/jobs`, props.data.id);

        try {
            console.log("🟢 Updating Firestore Status to:", selectedStatus);
            await updateDoc(jobRef, { status: selectedStatus });
            console.log("✅ Firestore Status Updated Successfully");

            props.node.setDataValue("status", selectedStatus);
            setIsEditing(false);
        } catch (error) {
            console.error("❌ Firestore Update Error:", error);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {isEditing ? (
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ width: "100px" }}>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            ) : (
                <span>{props.value}</span>
            )}

            {!isEditing ? (
                <button onClick={handleEditClick} className="edit-btn">Edit</button>
            ) : (
                <button onClick={handleSaveClick} className="save-btn">Save</button>
            )}
        </div>
    );
};

const JobGrid = () => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [gridHeight, setGridHeight] = useState("300px"); // Default height for 5 rows

    // ✅ Fetch Data from Firestore
    useEffect(() => {
        if (auth.currentUser) {
            const jobsRef = collection(db, `users/${auth.currentUser.uid}/jobs`);

            return onSnapshot(jobsRef, (snapshot) => {
                const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log("🔥 Firestore Snapshot Updated:", jobs);

                setRowData([...jobs]);

                // ✅ Adjust Grid Height Based on Row Count (min 5, max 20)
                const rowCount = Math.max(5, Math.min(jobs.length, 20)); // Ensures between 5 and 20 rows
                setGridHeight(`${rowCount * 50}px`); // Each row is 50px high
            });
        }
    }, []);

    const onRowEditingStopped = async (event) => {
        const updatedData = event.data;
        console.log("💾 Auto-Saving Row Data:", updatedData);

        const jobRef = doc(db, `users/${auth.currentUser.uid}/jobs`, updatedData.id);

        try {
            await updateDoc(jobRef, updatedData);
            console.log("✅ Firestore Row Auto-Saved Successfully");
        } catch (error) {
            console.error("❌ Firestore Auto-Save Error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this record?")) {
            await deleteDoc(doc(db, `users/${auth.currentUser.uid}/jobs`, id));
        }
    };

    const columns = [
        { field: "company", headerName: "Company", editable: true },
        { field: "joblink", headerName: "Job Link", editable: true },
        { field: "notes", headerName: "Notes", editable: true },
        {
            field: "status",
            headerName: "Status",
            cellRenderer: StatusCellRenderer,
        },
        {
            headerName: "Delete",
            field: "id",
            editable: false,
            cellRenderer: ({ value }) => (
                <IconButton size="small" color="error" onClick={() => handleDelete(value)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            ),
        },
    ];

    return (
        <div className="ag-theme-alpine" style={{ height: gridHeight, width: "90%", margin: "auto" }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={{ editable: true, resizable: true, flex: 1 }}
                editType="fullRow"
                stopEditingWhenCellsLoseFocus={true}
                onRowEditingStopped={onRowEditingStopped}
                overlayNoRowsTemplate="No job applications found."
                getRowId={(params) => params.data.id}
                pagination={true} // ✅ Enable Pagination
                paginationPageSize={10} // ✅ Set page size to 10
                domLayout="autoHeight" // ✅ Auto-adjust height based on content
            />
        </div>
    );
};

export default JobGrid;
