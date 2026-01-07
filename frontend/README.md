# 🧠 Parkinson's Disease Prediction - Frontend

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![CSS](https://img.shields.io/badge/CSS3-blue?logo=css3)

> Modern, responsive frontend for predicting **Parkinson's Disease** using voice biomarkers.  
> Connects to the **FastAPI backend** for real-time prediction.

---

## ✨ Features

- 🚀 Built with **React**  
- 🎨 Clean, modern UI/UX  
- 🌐 Connects to FastAPI backend for prediction  
- 📝 Form validation for input features  
- ⚡ Responsive design for desktop and mobile  
- 📊 Displays prediction, confidence, and probability  

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Tailwind CSS (or your CSS framework)  
- **API Integration:** Axios / Fetch API  
- **State Management:** React hooks (useState, useEffect)  
- **Deployment Ready:** Build scripts included  

---

## 📂 Project Structure

```text
📦 parkinsons-disease-prediction
│
├── 📂 frontend/
│ │
│ ├── 📂 public/
│ │ │ └── index.html            # Main HTML file
│ │
│ ├── 📂 src/
│ │ │ ├── App.jsx               # Main React component
│ │ │ ├── index.js              # React DOM entry point
│ │ │ └── index.css             # Global styles
│ │
│ ├── 📄 package.json           # Project metadata & dependencies
│ │ ├── 📄 package-lock.json    # Dependency lock file (safe to upload)
│ │ ├── 🚫 .gitignore           # Ignored files & folders
│ │ └── 📘 README.md            # Frontend documentation
│
└── 📂 backend/                 # FastAPI + ML model (separate service)

