import React, { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { Trash2, Calendar, User, Tag } from 'lucide-react';
import AvailabilityModal from './AvailabilityModal';

const EmployeeList = () => {
    const { employees, deleteEmployee, updateEmployee, roles, t, isRTL } = useApp();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [selectedRolesForEdit, setSelectedRolesForEdit] = useState([]);

    const handleEditTags = (employee) => {
        setEditingEmployeeId(employee.id);
        setSelectedRolesForEdit(employee.roles || []);
    };

    const handleSaveTags = (employeeId) => {
        updateEmployee(employeeId, { roles: selectedRolesForEdit });
        setEditingEmployeeId(null);
    };

    const toggleRole = (role) => {
        if (selectedRolesForEdit.includes(role)) {
            setSelectedRolesForEdit(selectedRolesForEdit.filter(r => r !== role));
        } else {
            setSelectedRolesForEdit([...selectedRolesForEdit, role]);
        }
    };

    if (employees.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                {t('noEmployees')}
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {employees.map(employee => (
                    <div key={employee.id} className="card" style={{ position: 'relative' }}>
                        <button
                            onClick={() => deleteEmployee(employee.id)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                [isRTL ? 'left' : 'right']: '1rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                            title={t('deleteEmployee')}
                        >
                            <Trash2 size={18} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                borderRadius: '50%',
                                background: 'var(--bg-tertiary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-primary)'
                            }}>
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="title" style={{ fontSize: '1.125rem', margin: 0 }}>{employee.name}</h4>
                                {editingEmployeeId !== employee.id && (
                                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                        {employee.roles.map(role => (
                                            <span key={role} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {editingEmployeeId === employee.id ? (
                            <>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label className="subtitle" style={{ display: 'block', marginBottom: '0.5rem' }}>{t('editTags')}</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {roles.map(role => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => toggleRole(role)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    border: '1px solid var(--accent)',
                                                    background: selectedRolesForEdit.includes(role) ? 'var(--accent)' : 'transparent',
                                                    color: selectedRolesForEdit.includes(role) ? 'white' : 'var(--accent)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.75rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => handleSaveTags(employee.id)}
                                    >
                                        {t('save')}
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={() => setEditingEmployeeId(null)}
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-secondary"
                                    style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}
                                    onClick={() => handleEditTags(employee)}
                                >
                                    <Tag size={16} /> {t('editTags')}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => setSelectedEmployeeId(employee.id)}
                                >
                                    <Calendar size={16} /> {t('manageAvailability')}
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {selectedEmployeeId && (
                <AvailabilityModal
                    employeeId={selectedEmployeeId}
                    onClose={() => setSelectedEmployeeId(null)}
                />
            )}
        </>
    );
};

export default EmployeeList;
