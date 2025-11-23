import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const MaterialDatePicker = ({ label, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef(null);

    useEffect(() => {
        if (value) {
            setCurrentMonth(new Date(value));
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleDateClick = (day) => {
        onChange(format(day, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="material-datepicker" ref={containerRef} style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    border: '1px solid transparent',
                    transition: 'all 0.2s'
                }}
            >
                <CalendarIcon size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.9rem' }}>
                    {value ? format(new Date(value), 'MMM d, yyyy') : 'Select date'}
                </span>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '0.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '1rem',
                    padding: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    border: '1px solid var(--bg-tertiary)',
                    zIndex: 100,
                    width: '300px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentMonth(subMonths(currentMonth, 1)); }}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span style={{ fontWeight: 600 }}>{format(currentMonth, 'MMMM yyyy')}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentMonth(addMonths(currentMonth, 1)); }}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem' }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        {weekDays.map(d => (
                            <div key={d} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d}</div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                        {days.map(day => {
                            const isSelected = value && isSameDay(new Date(value), day);
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                                        color: isSelected ? '#fff' : (isCurrentMonth ? 'var(--text-primary)' : 'var(--text-secondary)'),
                                        border: isToday && !isSelected ? '1px solid var(--accent)' : 'none',
                                        opacity: isCurrentMonth ? 1 : 0.3
                                    }}
                                >
                                    {format(day, 'd')}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialDatePicker;
