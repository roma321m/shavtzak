import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppProvider';
import MissionForm from './components/missions/MissionForm';
import MissionList from './components/missions/MissionList';
import EmployeeForm from './components/employees/EmployeeForm';
import EmployeeList from './components/employees/EmployeeList';
import TagManager from './components/employees/TagManager';
import AggregatedCalendar from './components/calendar/AggregatedCalendar';
import ScheduleManager from './components/schedule/ScheduleManager';
import { Briefcase, Users, Calendar, LayoutGrid, Languages } from 'lucide-react';
import { t, setCurrentLanguage, isRTL } from './utils/translations';
import './App.css';

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: active ? 'var(--accent)' : 'transparent',
      color: active ? 'white' : 'var(--text-secondary)',
      border: 'none',
      borderRadius: 'var(--radius)',
      fontWeight: 500,
      transition: 'all 0.2s'
    }}
  >
    <Icon size={18} />
    {label}
  </button>
);

const Dashboard = () => {
  const { language, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState('missions');
  const [missionToDuplicate, setMissionToDuplicate] = useState(null);
  const [missionToEdit, setMissionToEdit] = useState(null);

  // Update translation language and dir attribute when language changes
  React.useEffect(() => {
    setCurrentLanguage(language);
    document.documentElement.setAttribute('dir', language === 'he' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  const handleEdit = (mission) => {
    setMissionToEdit(mission);
    setMissionToDuplicate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicate = (mission) => {
    setMissionToDuplicate(mission);
    setMissionToEdit(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setMissionToDuplicate(null);
    setMissionToEdit(null);
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      {/* Language toggle in top corner */}
      <button
        onClick={toggleLanguage}
        style={{
          position: 'fixed',
          top: '1rem',
          right: isRTL() ? 'auto' : '1rem',
          left: isRTL() ? '1rem' : 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: 'var(--radius)',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 1000,
          boxShadow: 'var(--shadow)'
        }}
        title={language === 'en' ? 'Switch to עברית' : 'Switch to English'}
      >
        <Languages size={18} />
        {language === 'en' ? 'EN' : 'עב'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <TabButton active={activeTab === 'missions'} onClick={() => setActiveTab('missions')} icon={Briefcase} label={t('missions')} />
        <TabButton active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} icon={Users} label={t('employees')} />
        <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={Calendar} label={t('availability')} />
        <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={LayoutGrid} label={t('schedule')} />
      </div>

      <div style={{ minHeight: '500px' }}>
        {activeTab === 'missions' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <MissionForm
              initialData={missionToEdit || missionToDuplicate}
              isEditing={!!missionToEdit}
              onSuccess={handleSuccess}
            />
            <div>
              <h3 className="title">{t('existingMissions')}</h3>
              <MissionList
                onDuplicate={handleDuplicate}
                onEdit={handleEdit}
              />
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <TagManager />
            <EmployeeForm />
            <div>
              <h3 className="title">{t('teamMembers')}</h3>
              <EmployeeList />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <AggregatedCalendar />
        )}

        {activeTab === 'schedule' && (
          <ScheduleManager />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
