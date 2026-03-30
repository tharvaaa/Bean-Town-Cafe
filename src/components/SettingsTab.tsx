import React, { useState, useEffect } from 'react';
import { Moon, Sun, Save, AlertCircle } from 'lucide-react';
import db from '../db';

export function SettingsTab() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [problemText, setProblemText] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    // Check initial dark mode state
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSaveProblem = async () => {
    if (!problemText.trim()) return;
    
    setSaveStatus('saving');
    try {
      await db.problems.add({
        content: problemText,
        timestamp: new Date()
      });
      setSaveStatus('saved');
      setProblemText('');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save problem:', error);
      setSaveStatus('idle');
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="max-w-2xl space-y-8">
        {/* Appearance */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                {isDarkMode ? <Moon size={24} className="text-coffee-dark" /> : <Sun size={24} className="text-coffee-dark" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Dark Mode</h3>
                <p className="text-sm text-gray-500">Toggle dark mode appearance</p>
              </div>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-coffee-dark' : 'bg-gray-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Report Problem */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle size={24} className="text-coffee-dark" />
            Report a Problem
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Encountered a bug or have a suggestion? Let us know below.
            </p>
            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Describe the problem here..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-dark resize-none text-gray-900"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveProblem}
                disabled={!problemText.trim() || saveStatus === 'saving'}
                className="flex items-center gap-2 bg-coffee-dark text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-coffee-dark/20 hover:bg-[#6b7280] transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
