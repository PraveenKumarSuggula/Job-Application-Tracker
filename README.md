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
1. **Fork this repository**
   - Click the **Fork** button at the top-right of this repository on GitHub.
2. **Clone the forked repository**
   ```sh
   git clone https://github.com/YOUR_GITHUB_USERNAME/job-application-tracker.git
   ```
3. **Navigate to the project directory**
   ```sh
   cd job-application-tracker
   ```
4. **Install dependencies**
   ```sh
   npm install
   ```
   _or_
   ```sh
   yarn install
   ```
5. **Start the development server**
   ```sh
   npm start
   ```
   _or_
   ```sh
   yarn start
   ```
6. **Open in browser**
   - Navigate to `http://localhost:3000/`

## 🛠 How to Contribute
1. **Create a new feature branch**
   ```sh
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes and commit**
   ```sh
   git add .
   git commit -m "Added new feature: your-feature-name"
   ```
3. **Push to your forked repository**
   ```sh
   git push origin feature/your-feature-name
   ```
4. **Create a Pull Request**
   - Open a **Pull Request** from your forked repository to the main repository.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact
For any questions or suggestions, feel free to reach out!
praveenkumar.suggula0@gmail.com
https://www.linkedin.com/in/praveensuggula/

---
_Enjoy tracking your job applications! 🚀_
