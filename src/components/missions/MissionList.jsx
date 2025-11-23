import React from 'react';
import { useApp } from '../../context/AppProvider';
import { Edit, Copy, Trash2, Check, X, Clock, Users } from 'lucide-react';
import { t } from '../../utils/translations';

const MissionList = ({ onDuplicate, onEdit }) => {
    const { missions, deleteMission, updateMission } = useApp();

    if (missions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                {t('noMissions')}
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {missions.map(mission => {
                const isEnabled = mission.enabled !== false;
                return (
                    <div key={mission.id} className="card" style={{
                        position: 'relative',
                        opacity: isEnabled ? 1 : 0.6,
                        filter: isEnabled ? 'none' : 'grayscale(100%)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                                onClick={() => updateMission(mission.id, { enabled: !isEnabled })}
                                style={{
                                    background: isEnabled ? 'var(--success-light)' : 'var(--bg-tertiary)',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    padding: '0.25rem 0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    cursor: 'pointer',
                                    color: isEnabled ? 'var(--success)' : 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    marginRight: '0.5rem'
                                }}
                                title={isEnabled ? t('disableMission') : t('enableMission')}
                            >
                                {isEnabled ? <Check size={14} /> : <X size={14} />}
                                {isEnabled ? t('enabled') : t('disabled')}
                            </button>
                            <button
                                onClick={() => onEdit && onEdit(mission)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}
                                title={t('editMissionBtn')}
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => onDuplicate && onDuplicate(mission)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--accent)',
                                    cursor: 'pointer'
                                }}
                                title={t('duplicateMission')}
                            >
                                <Copy size={18} />
                            </button>
                            <button
                                onClick={() => deleteMission(mission.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer'
                                }}
                                title={t('deleteMission')}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <h4 className="title" style={{ fontSize: '1.25rem', marginTop: '2.5rem', paddingRight: '1rem' }}>{mission.name}</h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            <Clock size={16} />
                            <span>{mission.start} - {mission.end}</span>
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                                <Users size={16} />
                                <span>{t('requirements')}:</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {mission.requirements.map((req, i) => (
                                    <span key={i} style={{
                                        background: 'var(--bg-tertiary)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem'
                                    }}>
                                        {req.count} {req.role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MissionList;
