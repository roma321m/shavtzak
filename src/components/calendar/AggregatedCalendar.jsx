import React, { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Users, X } from 'lucide-react';

const AggregatedCalendar = () => {
    const { employees, t, dateLocale, isRTL } = useApp();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const getDayStats = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const available = employees.filter(e => e.availability?.some(a => a.date === dateStr));

        // Count by role
        const stats = available.reduce((acc, emp) => {
            emp.roles.forEach(role => {
                acc[role] = (acc[role] || 0) + 1;
            });
            return acc;
        }, {});

        return { count: available.length, stats, employees: available };
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="title" style={{ margin: 0 }}>{t('availabilityOverview')}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))} className="btn btn-secondary">
                        {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}</span>
                    <button onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))} className="btn btn-secondary">
                        {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map(d => <div key={d}>{d}</div>)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {days.map(day => {
                    const { count, stats, employees: dayEmployees } = getDayStats(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => setSelectedDay({ date: day, employees: dayEmployees, stats })}
                            style={{
                                minHeight: '100px',
                                backgroundColor: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius)',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                opacity: isCurrentMonth ? 1 : 0.3,
                                border: isSameMonth(day, new Date()) && day.getDate() === new Date().getDate() ? '1px solid var(--accent)' : '1px solid transparent',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                            }}
                        >
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{format(day, 'd')}</div>
                            {count > 0 ? (
                                <>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                                        {count} {t('available')}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                                        {Object.entries(stats).slice(0, 3).map(([role, num]) => (
                                            <div key={role}>{num} {role}</div>
                                        ))}
                                        {Object.keys(stats).length > 3 && <div>...</div>}
                                    </div>
                                </>
                            ) : (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <button
                            onClick={() => setSelectedDay(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 className="title">{t('available')} {t('on')} {format(selectedDay.date, 'MMM d, yyyy', { locale: dateLocale })}</h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{t('summary')}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {Object.entries(selectedDay.stats).map(([role, num]) => (
                                    <span key={role} style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.875rem' }}>
                                        {num} {role}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{t('employees')}</div>
                            {selectedDay.employees.length === 0 ? (
                                <div style={{ color: 'var(--text-secondary)' }}>{t('noEmployeesAvailable')}</div>
                            ) : (
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {selectedDay.employees.map(emp => (
                                        <div key={emp.id} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 500 }}>{emp.name}</span>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                {emp.roles.map(r => (
                                                    <span key={r} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AggregatedCalendar;
