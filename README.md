<div align="center">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="70" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="70" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" width="70" />

# 🧠 Parkinson’s Disease Prediction System
### AI-Powered Early Detection Using Voice Analysis

<p align="center">
<b>Machine Learning • FastAPI • React.js • Support Vector Classifier</b>
</p>

<p align="center">
<img src="https://img.shields.io/badge/ML-SVC-blueviolet?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge"/>
<img src="https://img.shields.io/badge/UI-Dark%20Theme-black?style=for-the-badge"/>
</p>

</div>

---

## 🌌 Project Overview

> **Parkinson’s Disease** is a progressive neurological disorder that affects speech and movement.  
> This project provides a **full-stack AI-powered solution** for **early Parkinson’s detection** using **voice-based biomedical features**.

✨ Users interact with a **modern dark-themed web interface** and receive **instant predictions** powered by a **Support Vector Classifier (SVC)** model.

---

## ✨ Key Highlights

<div align="center">

| 🚀 Feature | Description |
|----------|-------------|
| 🎨 UI Design | Dark theme with smooth animations |
| 🧪 Smart Form | Multi-step intelligent input flow |
| 🤖 ML Model | Accurate SVC-based prediction |
| ⚙️ Backend | FastAPI with REST architecture |
| 📊 Output | Prediction + confidence score |
| 📚 Learning | Medical resources included |
| 🏗️ Ready | Production-ready structure |

</div>

---

## 🖥️ Application Pages *(UI Concept)*

<div align="center">

| Page | Purpose |
|------|--------|
| 🏠 **Landing Page** | Project intro, animations & CTA |
| 🧪 **Input Form** | Multi-step medical feature input |
| 📊 **Results** | Prediction with confidence |
| ℹ️ **About** | Disease info & awareness |
| 📬 **Contact** | Feedback & help section |

</div>

---

## 🧠 Machine Learning Model

<div align="center">

### 🔍 Support Vector Classifier (SVC)

</div>

**Why SVC?**
- ✅ Excellent performance on biomedical datasets  
- ✅ Handles high-dimensional voice features  
- ✅ Reliable classification accuracy  

**Preprocessing Pipeline:**
- 🔹 Feature scaling using `StandardScaler`
- 🔹 Model persistence with `joblib`

---

## 🧬 Voice Feature Set

<details>
<summary><b>🔽 Click to expand all biomedical voice features</b></summary>

<br/>

- MDVP:Fo (Hz)
- MDVP:Fhi (Hz)
- MDVP:Flo (Hz)
- MDVP:Jitter (%)
- MDVP:Jitter (Abs)
- MDVP:RAP
- MDVP:PPQ
- Jitter:DDP
- MDVP:Shimmer (%)
- MDVP:Shimmer (dB)
- Shimmer:APQ3
- APQ5
- APQ
- Shimmer:DDA
- HNR
- RPDE
- DFA
- PPE

</details>

---

## 🏗️ Project Architecture

```text
📦 parkinsons-disease-prediction
│
├── 📂 backend/        → FastAPI + SVC Model
├── 📂 frontend/       → React.js (Dark UI)
├── 📂 dataset/        → Voice biomedical data
├── 📂 notebooks/     → Model training & evaluation
├── 📄 README.md
└── 📄 .gitignore
