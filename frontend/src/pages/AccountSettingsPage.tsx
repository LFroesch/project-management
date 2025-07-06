import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", 
  "garden", "forest", "aqua", "lofi", "pastel", "fantasy", 
  "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
  "business", "acid", "lemonade", "night", "coffee", "winter", "dim"
];

const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'cyberpunk';
  });

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-base-content/60">Customize your account preferences</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-base-100 rounded-xl shadow-lg p-6">
          {/* Theme Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Theme Preferences</h2>
              <p className="text-base-content/60">Choose a theme that suits your style</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme}
                  className={`group flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:scale-105 ${
                    currentTheme === theme 
                      ? "bg-primary/20 ring-2 ring-primary" 
                      : "hover:bg-base-200"
                  }`}
                  onClick={() => handleThemeChange(theme)}
                >
                  <div className="h-12 w-full rounded-lg overflow-hidden shadow-sm" data-theme={theme}>
                    <div className="h-full grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-center capitalize">
                    {theme}
                  </span>
                  {currentTheme === theme && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;