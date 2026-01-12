import React, { useState } from 'react';
import Login from './components/Login';
import ParticipantForm from './components/ParticipantForm';
import ParticipantGame from './components/ParticipantGame';
import OrganizerDashboard from './components/OrganizerDashboard';

type ViewState = 'login' | 'participant-form' | 'participant-game' | 'organizer';

interface ParticipantData {
  name: string;
  email: string;
  college: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);

  const handleOrganizerLogin = () => {
    setView('organizer');
  };

  const handleEnterParticipant = () => {
    setView('participant-form');
  };

  const handleParticipantStart = (name: string, email: string, college: string) => {
    setParticipantData({ name, email, college });
    setView('participant-game');
  };

  const handleBackToLogin = () => {
    setView('login');
    setParticipantData(null);
  };

  const handleLogout = () => {
    setView('login');
    setParticipantData(null);
  };

  return (
    <>
      {view === 'login' && (
        <Login
          onOrganizerLogin={handleOrganizerLogin}
          onEnterParticipant={handleEnterParticipant}
        />
      )}

      {view === 'participant-form' && (
        <ParticipantForm
          onStart={handleParticipantStart}
          onBack={handleBackToLogin}
        />
      )}

      {view === 'participant-game' && participantData && (
        <ParticipantGame
          name={participantData.name}
          email={participantData.email}
          college={participantData.college}
          onLogout={handleLogout}
        />
      )}

      {view === 'organizer' && (
        <OrganizerDashboard
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default App;
