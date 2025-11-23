import React, { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { generateSchedule } from '../../utils/scheduler';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import * as XLSX from 'xlsx';
import { Download, Calendar as CalendarIcon, RefreshCw, Trash2 } from 'lucide-react';
import MaterialDatePicker from '../ui/MaterialDatePicker';

const ScheduleManager = () => {
    const { missions, employees, schedule, updateSchedule, t, dateLocale } = useApp();
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(addDays(new Date(), 6), 'yyyy-MM-dd'));
    const [viewMode, setViewMode] = useState('employee'); // 'employee' or 'mission'

    const handleGenerate = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const newSchedule = generateSchedule(missions, employees, start, end, schedule);
        updateSchedule(newSchedule);
    };

    const handleExport = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = eachDayOfInterval({ start, end });

        const data = employees.map(emp => {
            const row = { [t('name')]: emp.name, [t('roles')]: emp.roles.join(', ') };
            days.forEach(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const shift = schedule.find(s => s.employeeId === emp.id && s.date === dateStr);
                row[dateStr] = shift ? `${shift.missionName} (${shift.role})` : '';
            });
            return row;
        });

        const unassigned = schedule.filter(s => !s.employeeId);
        if (unassigned.length > 0) {
            const unassignedRow = { [t('name')]: t('unassigned'), [t('roles')]: '' };
            days.forEach(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const shifts = unassigned.filter(s => s.date === dateStr);
                unassignedRow[dateStr] = shifts.map(s => `${s.missionName} (${s.role})`).join(', ');
            });
            data.push(unassignedRow);
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Schedule");
        XLSX.writeFile(wb, "shift_schedule.xlsx");
    };

    const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate)
    });

    const handleClear = () => {
        if (window.confirm(t('clearScheduleConfirm'))) {
            updateSchedule([]);
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h3 className="title" style={{ margin: 0 }}>{t('scheduleGenerator')}</h3>

                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
                        <button
                            onClick={() => setViewMode('employee')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'calc(var(--radius) - 0.25rem)',
                                border: 'none',
                                background: viewMode === 'employee' ? 'var(--accent)' : 'transparent',
                                color: viewMode === 'employee' ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('viewByEmployee')}
                        </button>
                        <button
                            onClick={() => setViewMode('mission')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'calc(var(--radius) - 0.25rem)',
                                border: 'none',
                                background: viewMode === 'mission' ? 'var(--accent)' : 'transparent',
                                color: viewMode === 'mission' ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('viewByMission')}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: '200px' }}>
                        <MaterialDatePicker
                            label={t('from')}
                            value={startDate}
                            onChange={setStartDate}
                        />
                    </div>
                    <div style={{ width: '200px' }}>
                        <MaterialDatePicker
                            label={t('to')}
                            value={endDate}
                            onChange={setEndDate}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
                        <button onClick={handleGenerate} className="btn btn-primary">
                            <RefreshCw size={18} /> {t('generate')}
                        </button>
                        <button onClick={handleExport} className="btn btn-secondary" disabled={schedule.length === 0}>
                            <Download size={18} /> {t('export')}
                        </button>
                        <button onClick={handleClear} className="btn btn-secondary" disabled={schedule.length === 0} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                            <Trash2 size={18} /> {t('clear')}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                {viewMode === 'employee' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{t('employee')}</th>
                                {days.map(day => (
                                    <th key={day.toString()} style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                        {format(day, 'EEE d', { locale: dateLocale })}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                                        {emp.name}
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.roles.join(', ')}</div>
                                    </td>
                                    {days.map(day => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const shift = schedule.find(s => s.employeeId === emp.id && s.date === dateStr);
                                        return (
                                            <td key={day.toString()} style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                {shift ? (
                                                    <div style={{
                                                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                        color: 'var(--accent)',
                                                        padding: '0.5rem',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        <div style={{ fontWeight: 600 }}>{shift.missionName}</div>
                                                        <div style={{ fontSize: '0.75rem' }}>{shift.role}</div>
                                                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{shift.start}-{shift.end}</div>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--bg-tertiary)' }}>-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {schedule.some(s => !s.employeeId) && (
                                <tr style={{ borderBottom: '1px solid var(--bg-tertiary)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--danger)' }}>{t('unassigned')}</td>
                                    {days.map(day => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const shifts = schedule.filter(s => !s.employeeId && s.date === dateStr);
                                        return (
                                            <td key={day.toString()} style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                {shifts.map((s, i) => (
                                                    <div key={i} style={{
                                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                        color: 'var(--danger)',
                                                        padding: '0.25rem',
                                                        borderRadius: 'var(--radius)',
                                                        fontSize: '0.75rem',
                                                        marginBottom: '0.25rem'
                                                    }}>
                                                        {s.missionName} ({s.role})
                                                    </div>
                                                ))}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{t('mission')}</th>
                                {days.map(day => (
                                    <th key={day.toString()} style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                        {format(day, 'EEE d', { locale: dateLocale })}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {missions
                                .filter(m => m.enabled !== false)
                                .sort((a, b) => {
                                    const startDiff = a.start.localeCompare(b.start);
                                    if (startDiff !== 0) return startDiff;
                                    return a.end.localeCompare(b.end);
                                })
                                .map(mission => (
                                    <tr key={mission.id} style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                                            {mission.name}
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mission.start} - {mission.end}</div>
                                        </td>
                                        {days.map(day => {
                                            const dateStr = format(day, 'yyyy-MM-dd');
                                            const shifts = schedule.filter(s => s.missionId === mission.id && s.date === dateStr);
                                            return (
                                                <td key={day.toString()} style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                    {shifts.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                            {shifts.map((shift, i) => {
                                                                const emp = employees.find(e => e.id === shift.employeeId);
                                                                return (
                                                                    <div key={i} style={{
                                                                        backgroundColor: shift.employeeId ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                                        color: shift.employeeId ? 'var(--success)' : 'var(--danger)',
                                                                        padding: '0.5rem',
                                                                        borderRadius: 'var(--radius)',
                                                                        fontSize: '0.875rem'
                                                                    }}>
                                                                        <div style={{ fontWeight: 600 }}>{emp ? emp.name : t('unassigned')}</div>
                                                                        <div style={{ fontSize: '0.75rem' }}>{shift.role}</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: 'var(--bg-tertiary)' }}>-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ScheduleManager;
