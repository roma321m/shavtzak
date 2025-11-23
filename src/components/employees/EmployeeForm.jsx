import React, { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { Plus, X } from 'lucide-react';
import { t } from '../../utils/translations';

const EmployeeForm = ({ onClose }) => {
    const { addEmployee, roles } = useApp();
    const [name, setName] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [newRole, setNewRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addEmployee({
            name,
            roles: selectedRoles
        });
        setName('');
        setSelectedRoles([]);
        if (onClose) onClose();
    };

    const toggleRole = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const addNewRole = () => {
        if (newRole && !AVAILABLE_ROLES.includes(newRole)) {
            // In a real app we might want to persist new roles globally
            toggleRole(newRole);
            setNewRole('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
            <h3 className="title">{t('addEmployee')}</h3>

            <div style={{ marginBottom: '1rem' }}>
                <label className="subtitle" style={{ display: 'block' }}>{t('fullName')}</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    required
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="subtitle" style={{ display: 'block', marginBottom: '0.5rem' }}>{t('rolesQualifications')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {roles.map(role => (
                        <button
                            key={role}
                            type="button"
                            onClick={() => toggleRole(role)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '2rem',
                                border: '1px solid var(--accent)',
                                background: selectedRoles.includes(role) ? 'var(--accent)' : 'transparent',
                                color: selectedRoles.includes(role) ? 'white' : 'var(--accent)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {role}
                        </button>
                    ))}
                </div>
                {/* Custom role input could go here if needed */}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {t('addEmployee')}
            </button>
        </form>
    );
};

export default EmployeeForm;
