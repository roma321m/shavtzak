import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('missions');
    return saved ? JSON.parse(saved) : [];
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [];
  });

  // Schedule: { [dateString]: { [missionId]: { [role]: employeeId[] } } } or similar
  // Let's keep it simple: Array of Shift objects
  // Shift: { id, date, missionId, assignments: { [role]: employeeId } }
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('schedule');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Schedule: { [dateString]: { [missionId]: { [role]: employeeId[] } } } or similar
  // Let's keep it simple: Array of Shift objects
  // Shift: { id, date, missionId, assignments: { [role]: employeeId } }

  const [roles, setRoles] = useState(() => {
    const saved = localStorage.getItem('roles');
    return saved ? JSON.parse(saved) : ['Manager', 'Driver', 'Medic', 'Regular'];
  });

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Actions
  const addMission = (mission) => {
    setMissions([...missions, { ...mission, id: uuidv4() }]);
  };

  const updateMission = (id, updated) => {
    setMissions(missions.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const deleteMission = (id) => {
    setMissions(missions.filter(m => m.id !== id));
  };

  const addEmployee = (employee) => {
    setEmployees([...employees, { ...employee, id: uuidv4(), availability: [] }]);
  };

  const updateEmployee = (id, updated) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const updateSchedule = (newSchedule) => {
    setSchedule(newSchedule);
  };

  const clearSchedule = () => {
    setSchedule([]);
  };

  const addRole = (role) => {
    if (!roles.includes(role)) {
      setRoles([...roles, role]);
    }
  };

  const deleteRole = (role) => {
    setRoles(roles.filter(r => r !== role));
  };

  const value = {
    missions,
    addMission,
    updateMission,
    deleteMission,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    schedule,
    updateSchedule,
    clearSchedule,
    roles,
    addRole,
    deleteRole,
    language,
    setLanguage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
