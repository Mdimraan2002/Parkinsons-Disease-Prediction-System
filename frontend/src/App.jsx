/**
=========================================================
🏥 Parkinson's Disease Prediction Frontend
=========================================================
Technology  : React + Tailwind CSS + Lucide Icons

⚠️ Medical Disclaimer:
This application is developed strictly for educational
and academic purposes. It is NOT a medical diagnostic
tool and must not be used for real medical decisions.

© 2026 Mohamed Imraan. All rights reserved.
=========================================================
*/

import React, { useState } from 'react';
import {
  Activity, Brain, Heart, Shield, ArrowRight, CheckCircle, AlertCircle,
  Home, Info, Mail, ArrowLeft, ExternalLink, Stethoscope, Sparkles, TrendingUp,
  Users, Award, User, FileText, Calendar, Phone, MapPin, Pill, Clock, AlertTriangle, Dna, Zap, Building2
} from 'lucide-react';

const App = () => {
  const [page, setPage] = useState('landing');
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const formFields = [
    {
      step: 0,
      title: 'Fundamental Frequency',
      icon: Activity,
      fields: [
        { name: 'mdvp_fo', label: 'MDVP:Fo (Hz)', min: 80, max: 300, default: 150 },
        { name: 'mdvp_fhi', label: 'MDVP:Fhi (Hz)', min: 100, max: 600, default: 200 },
        { name: 'mdvp_flo', label: 'MDVP:Flo (Hz)', min: 60, max: 250, default: 100 }
      ]
    },
    {
      step: 1,
      title: 'Jitter Measures',
      icon: TrendingUp,
      fields: [
        { name: 'mdvp_jitter_percent', label: 'MDVP:Jitter (%)', min: 0, max: 1, step: 0.001, default: 0.005 },
        { name: 'mdvp_jitter_abs', label: 'MDVP:Jitter (Abs)', min: 0, max: 0.0001, step: 0.000001, default: 0.00003 },
        { name: 'mdvp_rap', label: 'MDVP:RAP', min: 0, max: 0.5, step: 0.001, default: 0.003 },
        { name: 'mdvp_ppq', label: 'MDVP:PPQ', min: 0, max: 0.5, step: 0.001, default: 0.003 },
        { name: 'jitter_ddp', label: 'Jitter:DDP', min: 0, max: 1, step: 0.001, default: 0.009 }
      ]
    },
    {
      step: 2,
      title: 'Shimmer Measures',
      icon: Sparkles,
      fields: [
        { name: 'mdvp_shimmer', label: 'MDVP:Shimmer', min: 0, max: 1, step: 0.001, default: 0.03 },
        { name: 'mdvp_shimmer_db', label: 'MDVP:Shimmer (dB)', min: 0, max: 2, step: 0.01, default: 0.3 },
        { name: 'shimmer_apq3', label: 'Shimmer:APQ3', min: 0, max: 0.5, step: 0.001, default: 0.015 },
        { name: 'shimmer_apq5', label: 'Shimmer:APQ5', min: 0, max: 0.5, step: 0.001, default: 0.017 },
        { name: 'mdvp_apq', label: 'MDVP:APQ', min: 0, max: 1, step: 0.001, default: 0.024 },
        { name: 'shimmer_dda', label: 'Shimmer:DDA', min: 0, max: 1, step: 0.001, default: 0.045 }
      ]
    },
    {
      step: 3,
      title: 'Harmonic Measures',
      icon: Award,
      fields: [
        { name: 'nhr', label: 'NHR', min: 0, max: 1, step: 0.001, default: 0.025 },
        { name: 'hnr', label: 'HNR', min: 5, max: 35, step: 0.1, default: 22 },
        { name: 'rpde', label: 'RPDE', min: 0.2, max: 0.8, step: 0.001, default: 0.5 },
        { name: 'dfa', label: 'DFA', min: 0.5, max: 0.9, step: 0.001, default: 0.7 }
      ]
    },
    {
      step: 4,
      title: 'Nonlinear Measures',
      icon: Brain,
      fields: [
        { name: 'spread1', label: 'Spread1', min: -10, max: 0, step: 0.1, default: -5 },
        { name: 'spread2', label: 'Spread2', min: 0, max: 1, step: 0.001, default: 0.2 },
        { name: 'd2', label: 'D2', min: 1, max: 4, step: 0.01, default: 2.5 },
        { name: 'ppe', label: 'PPE', min: 0, max: 1, step: 0.001, default: 0.2 }
      ]
    }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const validateForm = () => {
    const allFields = formFields.flatMap(step => step.fields);
    const missingFields = allFields.filter(field => formData[field.name] === undefined || formData[field.name] === null);
    if (missingFields.length > 0) {
      setError('Please fill all fields');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Server error');
      const result = await response.json();
      setPrediction(result);
      setPage('result');
    } catch (err) {
      setError('Connection failed. Start backend server.');
      alert('Please start FastAPI server: python main.py');
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = () => {
    const data = {};
    formFields.forEach(step => step.fields.forEach(field => data[field.name] = field.default));
    setFormData(data);
  };

  const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="group flex items-center space-x-2 text-emerald-300 hover:text-white mb-8 transition-all duration-300 bg-emerald-900/20 hover:bg-emerald-800/40 px-6 py-3 rounded-xl border-2 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20 transform hover:scale-105">
      <ArrowLeft className="w-5 h-5 transition-transform duration-300" />
      <span className="font-semibold">Back</span>
    </button>
  );

  // --- Render Pages ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-green-950 text-white">
      
      {/* Landing Page */}
      {page === 'landing' && (
        <div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
          </div>
          <nav className="relative z-10 flex justify-between items-center p-6 bg-black/30 backdrop-blur-md border-b border-emerald-500/20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold">NeuroPredict AI</span>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => setPage('home')} className="px-4 py-2 rounded-lg hover:text-emerald-300">Home</button>
              <button onClick={() => setPage('about')} className="px-4 py-2 rounded-lg hover:text-emerald-300">About</button>
              <button onClick={() => setPage('patient')} className="px-4 py-2 rounded-lg hover:text-emerald-300">Profile</button>
              <button onClick={() => setPage('contact')} className="px-4 py-2 rounded-lg hover:text-emerald-300">Contact</button>
            </div>
          </nav>
          <div className="text-center mt-20">
            <Stethoscope className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300">Parkinson's Disease Prediction</h1>
            <p className="text-2xl text-emerald-100 mb-6">AI-Powered Voice Analysis for Early Detection</p>
            <button onClick={() => { setPage('form'); fillSampleData(); }} className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full font-bold text-xl inline-flex items-center space-x-3">
              <span>Start Analysis</span>
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Form Page */}
      {page === 'form' && (
        <div className="p-10 max-w-3xl mx-auto">
          <BackButton onClick={() => setPage('landing')} />
          <h2 className="text-4xl font-bold mb-6 flex items-center space-x-3">
            {formFields[formStep].icon && <formFields[formStep].icon className="w-10 h-10" />}
            <span>{formFields[formStep].title}</span>
          </h2>
          {formFields[formStep].fields.map(field => (
            <div key={field.name} className="mb-4">
              <label className="block mb-2">{field.label}</label>
              <input
                type="number"
                value={formData[field.name] ?? ''}
                min={field.min} max={field.max} step={field.step || 1}
                onChange={e => handleInputChange(field.name, e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-black"
              />
            </div>
          ))}
          <div className="flex justify-between mt-6">
            {formStep > 0 && <button onClick={() => setFormStep(prev => prev - 1)} className="px-6 py-3 bg-emerald-600 rounded-lg">Previous</button>}
            {formStep < formFields.length - 1
              ? <button onClick={() => setFormStep(prev => prev + 1)} className="px-6 py-3 bg-emerald-600 rounded-lg">Next</button>
              : <button onClick={handleSubmit} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">{loading ? 'Analyzing...' : 'Predict'}</button>
            }
          </div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      )}

      {/* Result Page */}
      {page === 'result' && prediction && (
        <div className="p-10 max-w-2xl mx-auto text-center">
          <BackButton onClick={() => { setPage('form'); setPrediction(null); }} />
          <CheckCircle className="w-20 h-20 mx-auto text-green-400 mb-6" />
          <h2 className="text-4xl font-bold mb-4">Prediction Result</h2>
          <p className="text-xl mb-2">Parkinson's Disease Probability: <span className="font-bold">{(prediction.probability * 100).toFixed(2)}%</span></p>
          <p className="text-xl mb-6">Prediction: <span className="font-bold">{prediction.label}</span></p>
          <button onClick={() => { setPage('landing'); setPrediction(null); }} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">Back to Home</button>
        </div>
      )}

      {/* About Page */}
      {page === 'about' && (
        <div className="p-10 max-w-3xl mx-auto">
          <BackButton onClick={() => setPage('landing')} />
          <h2 className="text-4xl font-bold mb-6 flex items-center space-x-3"><Info className="w-10 h-10" /><span>About NeuroPredict AI</span></h2>
          <p className="mb-4">NeuroPredict AI is a research and educational tool developed to demonstrate the application of AI in early detection of Parkinson's Disease through voice analysis.</p>
          <p>⚠️ This application is NOT a medical diagnostic tool and is intended for educational purposes only.</p>
        </div>
      )}

      {/* Patient/Profile Page */}
      {page === 'patient' && (
        <div className="p-10 max-w-3xl mx-auto">
          <BackButton onClick={() => setPage('landing')} />
          <h2 className="text-4xl font-bold mb-6 flex items-center space-x-3"><User className="w-10 h-10" /><span>Patient Profile</span></h2>
          <p>This section can be expanded to allow users to view or edit their personal data, previous predictions, and history.</p>
        </div>
      )}

      {/* Contact Page */}
      {page === 'contact' && (
        <div className="p-10 max-w-3xl mx-auto">
          <BackButton onClick={() => setPage('landing')} />
          <h2 className="text-4xl font-bold mb-6 flex items-center space-x-3"><Mail className="w-10 h-10" /><span>Contact Us</span></h2>
          <p>For queries, feedback, or collaboration:</p>
          <ul className="mt-4 space-y-2">
            <li><span className="font-bold">Email:</span> contact@neuropredict.ai</li>
            <li><span className="font-bold">Phone:</span> +91 12345 67890</li>
            <li><span className="font-bold">Address:</span> 123 AI Street, Tech City</li>
          </ul>
        </div>
      )}

    </div>
  );
};

export default App;
