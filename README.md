# Job Application Tracker App

## Overview
The **Job Application Tracker App** is a React-based tool designed to help job seekers efficiently log, track, and manage their job applications. Users can seamlessly integrate their job tracking process by linking an existing **CSV/Excel file** or creating a new one. The app provides a structured logging system with essential fields and customizable options to ensure comprehensive tracking.

## Features
### 🔗 **Seamless Data Integration**
- Users can **link their CSV/Excel file** to store job application data.
- Direct input of application details through a **user-friendly form**.

### 📋 **Structured Job Application Logging**
- Predefined fields include:
  - **Company Name**
  - **Job Application Link**
  - **Date Applied**
  - **Current Status** (e.g., Applied, Interview Scheduled, Rejected, etc.)
  - **Resume Used** (Google Drive link for reference)
  - **Uploaded Resume** (File upload with validation)
  - **Additional Notes**

### 📂 **Resume Upload Management**
- Users must provide a **resume link** before uploading a file.
- If both **resume link & file upload** fields are empty, manual upload via user input form is allowed.

### 🛠 **Customizable Fields**
- Users can **add custom columns** using an input field (e.g., Recruiter Contact, Salary Expectations, etc.).

### 📊 **Excel Data Storage & Editing**
- Data is **saved back to the linked Excel file** when the user submits.
- **AG-Grid integration** for interactive inline editing.
- Updates are stored upon clicking the **Submit** button.

## 🚀 Getting Started
### Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (>=16.x.x)
- **npm** or **yarn**
- **Git**

### 🔥 Installation & Setup
```sh
# Fork this repository
# Click the Fork button at the top-right of this repository on GitHub.

# Clone the forked repository
git clone https://github.com/YOUR_GITHUB_USERNAME/job-application-tracker.git

# Navigate to the project directory
cd job-application-tracker

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm start
# or
yarn start

# Open in browser
# Navigate to http://localhost:3000/
```

## 🔧 **Enable Google Sheets API & Google Drive API**
To integrate Google Sheets for storing job applications, follow these steps:

### **Step 1: Enable APIs in Google Cloud Console**
```sh
# Go to Google Cloud Console
# Select or create a new project
# Enable Google Sheets API and Google Drive API
```

### **Step 2: Create a Service Account**
```sh
# Navigate to IAM & Admin > Service Accounts
# Click "Create Service Account"
# Enter a name (e.g., job-tracker-service)
# Click "Create & Continue"
# Grant the "Editor" role
# Click "Done"
```

### **Step 3: Generate Service Account Credentials**
```sh
# In the Service Accounts list, select the newly created service account
# Go to the "Keys" tab
# Click "Add Key" > "Create new key"
# Select JSON format and click "Create"
# A credentials.json file will be downloaded - keep it safe!
```

### **Step 4: Share Google Sheets Access with Service Account**
```sh
# Open your Google Sheet
# Click "Share" (top-right corner)
# Copy the email address of your service account
# Paste it in the "Add people and groups" field
# Set the role to "Editor"
# Click "Send"
```

## 🛠 How to Contribute
```sh
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "Added new feature: your-feature-name"

# Push to your forked repository
git push origin feature/your-feature-name

# Create a Pull Request
# Open a Pull Request from your forked repository to the main repository.
```

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact
For any questions or suggestions, feel free to reach out!
praveenkumar.suggula0@gmail.com  
[LinkedIn](https://www.linkedin.com/in/praveensuggula/)

---
_Enjoy tracking your job applications! 🚀_
