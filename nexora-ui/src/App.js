import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

// Simple SVG Icons as components
const RocketIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tabs = [
    {
      id: 'plan',
      title: 'Smart Planner',
      description: 'Create personalized action plans with market insights',
      icon: <RocketIcon />,
      color: 'blue-cyan',
      placeholder: 'Describe your goal or project you want to plan...',
      examples: [
        'Launch a tech startup in 2025',
        'Learn digital marketing and get certified',
        'Start a YouTube channel about cooking',
        'Build a mobile app for fitness tracking'
      ]
    },
    {
      id: 'blog',
      title: 'Blog Writer',
      description: 'Generate comprehensive blogs with market analysis',
      icon: <DocumentIcon />,
      color: 'purple-pink',
      placeholder: 'Enter the topic you want to write a blog about...',
      examples: [
        'The Future of Artificial Intelligence in 2025',
        'Sustainable Living: Trends and Tips',
        'Remote Work: Best Practices and Tools',
        'Cryptocurrency Market Analysis'
      ]
    },
    {
      id: 'research',
      title: 'Market Research',
      description: 'Get latest market trends and insights',
      icon: <SearchIcon />,
      color: 'orange-red',
      placeholder: 'What market or topic would you like to research...',
      examples: [
        'Electric vehicle market trends 2025',
        'Social media marketing statistics',
        'E-commerce growth in developing countries',
        'Renewable energy investment opportunities'
      ]
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = `${API_BASE_URL}/${activeTab}`;
      const payload = activeTab === 'plan' ? { goal: input } : 
                     activeTab === 'blog' ? { topic: input } : 
                     { query: input };

      const response = await axios.post(endpoint, payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setInput(example);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    const content = result.plan || result.blog || result.research;
    try {
      await navigator.clipboard.writeText(content);
      alert('Content copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadAsMarkdown = () => {
    if (!result) return;
    const content = result.plan || result.blog || result.research;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <SparklesIcon />
              </div>
              <div>
                <h1 className="main-title">Nexora AI</h1>
                <p className="subtitle">
                  Your intelligent assistant for planning, writing, and market research
                </p>
              </div>
            </div>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>AI Services Online</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">
          {/* Tabs */}
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? `active ${tab.color}` : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult(null);
                  setError(null);
                  setInput('');
                }}
              >
                <div className="tab-icon">{tab.icon}</div>
                <h3 className="tab-title">{tab.title}</h3>
                <p className="tab-description">{tab.description}</p>
              </button>
            ))}
          </div>

          {/* Input Section */}
          <div className="input-section fade-in">
            <div className="section-header">
              <h2 className={`section-title ${currentTab.color}`}>
                {currentTab.title}
              </h2>
              <p className="section-subtitle">{currentTab.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="input-form">
              <div className="textarea-container">
                <textarea
                  className="main-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentTab.placeholder}
                  maxLength={1000}
                />
                <div className="char-counter">
                  {input.length}/1000
                </div>
              </div>

              <button
                type="submit"
                className={`submit-button ${currentTab.color} ${loading || !input.trim() ? 'disabled' : ''}`}
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>Generate {currentTab.title}</span>
                    {currentTab.icon}
                  </>
                )}
              </button>
            </form>

            {/* Examples */}
            <div className="examples-section">
              <h4 className="examples-title">Try these examples:</h4>
              <div className="examples-grid">
                {currentTab.examples.map((example, index) => (
                  <button
                    key={index}
                    className="example-button"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-section slide-up">
              <div className="loading-content-center">
                <div className="loading-spinner-large">
                  <div className="spinner-ring"></div>
                </div>
                <div className="loading-text">
                  <h3>AI is working on your request...</h3>
                  <p>This may take a few moments while we research and generate your content.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="results-section slide-up" style={{borderColor: '#ef4444'}}>
              <div className="results-header">
                <div className="results-title-section">
                  <h3 style={{color: '#ef4444'}}>Error</h3>
                  <p className="results-subtitle">Something went wrong</p>
                </div>
              </div>
              <div className="results-content">
                <p style={{color: '#fca5a5'}}>{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="results-section slide-up">
              <div className="results-header">
                <div className="results-title-section">
                  <h3 className={`results-title ${currentTab.color}`}>
                    {currentTab.title} Results
                  </h3>
                  <p className="results-subtitle">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="results-actions">
                  <button className="action-button copy-button" onClick={copyToClipboard}>
                    <CopyIcon />
                    Copy
                  </button>
                  <button className="action-button download-button" onClick={downloadAsMarkdown}>
                    <DownloadIcon />
                    Download
                  </button>
                </div>
              </div>
              <div className="results-content">
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <h1 className="md-h1">{children}</h1>,
                      h2: ({children}) => <h2 className="md-h2">{children}</h2>,
                      h3: ({children}) => <h3 className="md-h3">{children}</h3>,
                      p: ({children}) => <p className="md-p">{children}</p>,
                      ul: ({children}) => <ul className="md-ul">{children}</ul>,
                      ol: ({children}) => <ol className="md-ol">{children}</ol>,
                      li: ({children}) => <li className="md-li">{children}</li>,
                      strong: ({children}) => <strong className="md-strong">{children}</strong>,
                      a: ({href, children}) => <a href={href} className="md-link" target="_blank" rel="noopener noreferrer">{children}</a>,
                      blockquote: ({children}) => <blockquote className="md-blockquote">{children}</blockquote>,
                      code: ({children}) => <code className="md-code">{children}</code>,
                      pre: ({children}) => <pre className="md-pre">{children}</pre>
                    }}
                  >
                    {result.plan || result.blog || result.research}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p className="footer-text">
              Powered by Nexora AI - Intelligent Planning, Writing & Research
            </p>
            <div className="footer-links">
              <span>Built with React & Flask</span>
              <span>•</span>
              <span>AI-Powered Insights</span>
              <span>•</span>
              <span>Real-time Market Data</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
