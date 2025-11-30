import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import SurveyEditorScreen from './components/SurveyEditorScreen';
import ReportsScreen from './components/ReportsScreen';

type Screen = 'login' | 'dashboard' | 'editor' | 'reports';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  const handleCreateSurvey = () => {
    setSelectedSurvey(null);
    setCurrentScreen('editor');
  };

  const handleEditSurvey = (survey: any) => {
    setSelectedSurvey(survey);
    setCurrentScreen('editor');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'dashboard' && (
        <DashboardScreen 
          onNavigate={navigateTo}
          onCreateSurvey={handleCreateSurvey}
          onEditSurvey={handleEditSurvey}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'editor' && (
        <SurveyEditorScreen 
          onNavigate={navigateTo}
          survey={selectedSurvey}
        />
      )}
      {currentScreen === 'reports' && (
        <ReportsScreen onNavigate={navigateTo} />
      )}
    </div>
  );
}
