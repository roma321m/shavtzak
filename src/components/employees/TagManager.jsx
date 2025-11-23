import React, { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { Plus, X, Tag } from 'lucide-react';
import { t } from '../../utils/translations';

const TagManager = () => {
    const { roles, addRole, deleteRole } = useApp();
    const [newRole, setNewRole] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newRole.trim()) {
            addRole(newRole.trim());
            setNewRole('');
        }
    };

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Tag size={20} color="var(--accent)" />
                <h3 className="title" style={{ margin: 0 }}>{t('manageTags')}</h3>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {roles.map(role => (
                    <div key={role} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem'
                    }}>
                        <span>{role}</span>
                        <button
                            onClick={() => deleteRole(role)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex'
                            }}
                            title={t('deleteTag')}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder={t('newTagName')}
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-secondary">
                    <Plus size={16} /> {t('add')}
                </button>
            </form>
        </div>
    );
};

export default TagManager;
