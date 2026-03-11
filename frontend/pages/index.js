import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setError('Please select a file first.');
      return;
    }
    if (!email) {
      setError('Please enter an email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setEmail('');
    setSuccess(false);
    setError('');
  }

  return (
    <>
      <Head>
        <title>Rabbitt AI — Sales Insight Automator</title>
        <meta name="description" content="Upload your data file and receive an AI-powered summary via email" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <header className="header">
          <div className="logo">Rabbitt AI</div>
          <p className="tagline">Sales Insight Automator</p>
        </header>

        <div className="card">
          {success ? (
            <div className="success-box">
              <div className="success-icon">✅</div>
              <div className="success-title">Summary sent to {email}!</div>
              <p className="success-subtitle">
                Check your inbox — the AI summary is on its way.
              </p>
              <button className="reset-btn" onClick={handleReset}>
                Upload another file
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                className={`dropzone ${dragActive ? 'dragover' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div className="dropzone-icon">📁</div>
                <div className="dropzone-text">
                  Drag & drop your file here
                  <br />
                  <span style={{ fontSize: '12px', color: '#666' }}>or click to browse</span>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {file && (
                <div className="file-info">
                  <span className="checkmark">✅</span>
                  <span className="filename">{file.name}</span>
                  <span className="filesize">{formatSize(file.size)}</span>
                </div>
              )}

              <p className="accepted-formats">
                Accepts .csv and .xlsx files (max 5MB)
              </p>

              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className="email-input"
                  placeholder="Enter recipient email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading || !file || !email}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing your data...
                  </>
                ) : (
                  'Generate & Send Summary →'
                )}
              </button>

              {error && (
                <div className="error-box">
                  <div className="error-icon">⚠️</div>
                  <p className="error-text">{error}</p>
                  <button
                    type="button"
                    className="try-again-btn"
                    onClick={() => setError('')}
                  >
                    Try again
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        <p className="footer-text">
          Powered by Rabbitt AI — Built with Groq + Next.js
        </p>
      </div>
    </>
  );
}
