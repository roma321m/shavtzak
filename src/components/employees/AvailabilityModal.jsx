import React, { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import MaterialTimePicker from '../ui/MaterialTimePicker';

const AvailabilityModal = ({ employeeId, onClose }) => {
    const { employees, updateEmployee, t, dateLocale, isRTL } = useApp();
    const employee = employees.find(e => e.id === employeeId);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Availability is stored as: [ { date: 'YYYY-MM-DD', start: '09:00', end: '17:00' }, ... ]
    // Helper to find availability for a date
    const getAvailability = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return employee.availability?.find(a => a.date === dateStr);
    };

    const handleSaveAvailability = (date, start, end) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        let newAvailability = [...(employee.availability || [])];

        // Remove existing if any
        newAvailability = newAvailability.filter(a => a.date !== dateStr);

        // Add new
        newAvailability.push({ date: dateStr, start, end });

        updateEmployee(employeeId, { availability: newAvailability });
        setSelectedDate(null);
    };

    const handleDeleteAvailability = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        let newAvailability = [...(employee.availability || [])];
        newAvailability = newAvailability.filter(a => a.date !== dateStr);
        updateEmployee(employeeId, { availability: newAvailability });
        setSelectedDate(null);
    };

    if (!employee) return null;

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const weekDays = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h3 className="title">{t('availability')}: {employee.name}</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn btn-secondary">
                        {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}</span>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn btn-secondary">
                        {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {weekDays.map(d => <div key={d}>{d}</div>)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                    {days.map(day => {
                        const avail = getAvailability(day);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                style={{
                                    aspectRatio: '1',
                                    backgroundColor: avail ? 'rgba(34, 197, 94, 0.2)' : 'var(--bg-tertiary)',
                                    border: avail ? '1px solid var(--success)' : '1px solid transparent',
                                    borderRadius: 'var(--radius)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    opacity: isCurrentMonth ? 1 : 0.3,
                                    position: 'relative'
                                }}
                            >
                                <span style={{ fontWeight: 500 }}>{format(day, 'd')}</span>
                                {avail && (
                                    <div style={{ fontSize: '0.6rem', marginTop: '0.25rem', color: 'var(--success)' }}>
                                        {avail.start === '00:00' && avail.end === '00:00' ? t('allDay') : `${avail.start}-${avail.end}`}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {selectedDate && (
                    <DayEditor
                        date={selectedDate}
                        initialAvailability={getAvailability(selectedDate)}
                        onSave={handleSaveAvailability}
                        onDelete={handleDeleteAvailability}
                        onClose={() => setSelectedDate(null)}
                        t={t}
                        dateLocale={dateLocale}
                    />
                )}
            </div>
        </div>
    );
};

const DayEditor = ({ date, initialAvailability, onSave, onDelete, onClose, t, dateLocale }) => {
    const [start, setStart] = useState(initialAvailability?.start || '09:00');
    const [end, setEnd] = useState(initialAvailability?.end || '17:00');
    const [isAllDay, setIsAllDay] = useState(
        initialAvailability?.start === '00:00' && initialAvailability?.end === '00:00'
    );

    const handleSave = () => {
        if (isAllDay) {
            onSave(date, '00:00', '00:00');
        } else {
            onSave(date, start, end);
        }
    };

    return (
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', border: '1px solid var(--bg-tertiary)',
            width: '300px', zIndex: 10
        }}>
            <h4 className="title" style={{ fontSize: '1.1rem' }}>{t('edit')} {format(date, 'MMM d', { locale: dateLocale })}</h4>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        style={{ width: 'auto' }}
                    />
                    {t('allDay')} (00:00 - 00:00)
                </label>
            </div>

            {!isAllDay && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <MaterialTimePicker
                        label={t('startTime')}
                        value={start}
                        onChange={setStart}
                    />
                    <MaterialTimePicker
                        label={t('endTime')}
                        value={end}
                        onChange={setEnd}
                    />
                </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>{t('save')}</button>
                {initialAvailability && (
                    <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => onDelete(date)}>{t('remove')}</button>
                )}
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>{t('cancel')}</button>
            </div>
        </div>
    );
};

export default AvailabilityModal;
