import React, { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { Plus, Trash2 } from 'lucide-react';
import MaterialTimePicker from '../ui/MaterialTimePicker';
import { t } from '../../utils/translations';

const MissionForm = ({ onClose, onSuccess, initialData, isEditing }) => {
    const { addMission, updateMission, roles } = useApp();
    const [name, setName] = useState('');
    const [start, setStart] = useState('09:00');
    const [end, setEnd] = useState('17:00');
    const [enabled, setEnabled] = useState(true);
    const [requirements, setRequirements] = useState([{ role: roles[0] || '', count: 1 }]);

    React.useEffect(() => {
        if (initialData) {
            setName(isEditing ? initialData.name : initialData.name + ' (Copy)');
            setStart(initialData.start);
            setEnd(initialData.end);
            setEnabled(initialData.enabled !== false); // Default to true if undefined
            // Deep copy requirements to avoid reference issues
            setRequirements(initialData.requirements.map(r => ({ ...r })));
        } else {
            // Reset if no initialData (e.g. when switching from edit to create)
            setName('');
            setStart('09:00');
            setEnd('17:00');
            setEnabled(true);
            setRequirements([{ role: roles[0] || '', count: 1 }]);
        }
    }, [initialData, isEditing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const missionData = {
            name,
            start,
            end,
            enabled,
            requirements
        };

        if (isEditing && initialData) {
            updateMission(initialData.id, missionData);
        } else {
            addMission(missionData);
        }

        // Reset or close
        setName('');
        setEnabled(true);
        setRequirements([{ role: roles[0] || '', count: 1 }]);
        if (onClose) onClose();
        if (onSuccess) onSuccess();
    };

    const addRequirement = () => {
        setRequirements([...requirements, { role: roles[0] || '', count: 1 }]);
    };

    const removeRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const updateRequirement = (index, field, value) => {
        const newReqs = [...requirements];
        newReqs[index][field] = value;
        setRequirements(newReqs);
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
            <h3 className="title">{isEditing ? t('editMission') : t('createMission')}</h3>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label className="subtitle" style={{ display: 'block' }}>{t('missionName')}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('missionNamePlaceholder')}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="checkbox"
                        id="mission-enabled"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        style={{ width: 'auto' }}
                    />
                    <label htmlFor="mission-enabled" style={{ cursor: 'pointer' }}>{t('missionEnabled')}</label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <MaterialTimePicker
                            label={t('startTime')}
                            value={start}
                            onChange={setStart}
                        />
                    </div>
                    <div>
                        <MaterialTimePicker
                            label={t('endTime')}
                            value={end}
                            onChange={setEnd}
                        />
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="subtitle" style={{ display: 'block', marginBottom: '0.5rem' }}>{t('roleRequirements')}</label>
                {requirements.map((req, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="number"
                            min="1"
                            value={req.count}
                            onChange={(e) => updateRequirement(index, 'count', parseInt(e.target.value))}
                            style={{ width: '80px' }}
                        />
                        <select
                            value={req.role}
                            onChange={(e) => updateRequirement(index, 'role', e.target.value)}
                            style={{ flex: 1 }}
                        >
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem', color: 'var(--danger)' }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addRequirement} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    <Plus size={16} /> {t('addRole')}
                </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {isEditing ? t('updateMission') : t('saveMission')}
            </button>
        </form>
    );
};

export default MissionForm;
