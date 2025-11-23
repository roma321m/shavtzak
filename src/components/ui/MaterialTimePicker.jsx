import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

const MaterialTimePicker = ({ label, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Parse initial value (HH:mm)
    const [hours, setHours] = useState(parseInt(value.split(':')[0]));
    const [minutes, setMinutes] = useState(parseInt(value.split(':')[1]));
    const [mode, setMode] = useState('hours'); // 'hours' | 'minutes'

    useEffect(() => {
        const [h, m] = value.split(':');
        setHours(parseInt(h));
        setMinutes(parseInt(m));
    }, [value]);

    const handleSave = () => {
        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        onChange(`${h}:${m}`);
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <label className="subtitle" style={{ display: 'block' }}>{label}</label>
            <div
                onClick={() => setIsOpen(true)}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                }}
            >
                <span>{value}</span>
                <Clock size={16} color="var(--text-secondary)" />
            </div>

            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '320px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', backgroundColor: '#2b2d31' }}>

                        {/* Header / Display */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <div
                                onClick={() => setMode('hours')}
                                style={{
                                    fontSize: '3.5rem',
                                    fontWeight: 500,
                                    color: mode === 'hours' ? 'var(--accent)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    backgroundColor: mode === 'hours' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                {hours.toString().padStart(2, '0')}
                            </div>
                            <span style={{ fontSize: '3.5rem', color: 'var(--text-secondary)' }}>:</span>
                            <div
                                onClick={() => setMode('minutes')}
                                style={{
                                    fontSize: '3.5rem',
                                    fontWeight: 500,
                                    color: mode === 'minutes' ? 'var(--accent)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    backgroundColor: mode === 'minutes' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                {minutes.toString().padStart(2, '0')}
                            </div>
                        </div>

                        {/* Clock Face */}
                        <ClockFace
                            mode={mode}
                            value={mode === 'hours' ? hours : minutes}
                            onChange={(val) => {
                                if (mode === 'hours') {
                                    setHours(val);
                                    setMode('minutes'); // Auto-advance
                                } else {
                                    setMinutes(val);
                                }
                            }}
                        />

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '1rem' }}>
                            <button onClick={() => setIsOpen(false)} className="btn" style={{ color: 'var(--accent)' }}>Cancel</button>
                            <button onClick={handleSave} className="btn" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ClockFace = ({ mode, value, onChange }) => {
    const radius = 100; // px
    const size = 250; // px
    const center = size / 2;

    // Generate numbers
    const numbers = [];
    if (mode === 'hours') {
        // 24h format: Inner ring (13-23, 00), Outer ring (1-12) ?? 
        // Actually Material 3 24h: Outer = 00-23? No.
        // Usually: Inner = 13, 14... 00. Outer = 1, 2... 12.
        // Let's do: Outer = 00, 1, 2... 11. Inner = 12, 13... 23.
        // Wait, standard 24h clock: 
        // 00 is top.
        // Let's stick to a single ring 0-23 if possible? Too crowded.
        // Let's do two rings.
        // Outer: 00, 01... 11
        // Inner: 12, 13... 23
        // Or standard: Outer 1-12, Inner 13-00.
        // Let's implement: Outer = 0, 1, ... 11. Inner = 12, 13 ... 23.

        for (let i = 0; i < 12; i++) {
            numbers.push({ value: i, label: i === 0 ? '00' : i, angle: i * 30, isInner: false });
        }
        for (let i = 12; i < 24; i++) {
            numbers.push({ value: i, label: i, angle: (i - 12) * 30, isInner: true });
        }
    } else {
        // Minutes: 0, 5, 10... 55
        for (let i = 0; i < 12; i++) {
            numbers.push({ value: i * 5, label: (i * 5).toString().padStart(2, '0'), angle: i * 30, isInner: false });
        }
    }

    const getPosition = (angle, isInner) => {
        const r = isInner ? radius * 0.65 : radius;
        const rad = (angle - 90) * (Math.PI / 180);
        return {
            left: center + r * Math.cos(rad),
            top: center + r * Math.sin(rad)
        };
    };

    const handleMouseDown = (e) => {
        handleInteraction(e);
        // Add listeners for drag
        document.addEventListener('mousemove', handleInteraction);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleInteraction);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleInteraction = (e) => {
        // Calculate angle from center
        const rect = e.target.closest('.clock-face').getBoundingClientRect();
        const x = e.clientX - rect.left - center;
        const y = e.clientY - rect.top - center;

        // Angle in degrees (0 is up? No, atan2 0 is right)
        // atan2(y, x) -> -PI to PI. 
        // We want 0 at top (-90deg).
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;

        // Snap to nearest 30deg (or 6deg for minutes if we want precise)
        // For now snap to 30deg (5 min steps / 1 hour steps)
        const step = mode === 'minutes' ? 6 : 30;
        let snappedAngle = Math.round(angle / step) * step;

        // Determine value
        let val;
        if (mode === 'hours') {
            // Check distance for inner/outer
            const dist = Math.sqrt(x * x + y * y);
            const isInner = dist < radius * 0.8; // Threshold

            // Angle 0 = 00 or 12.
            // Angle 30 = 1 or 13.
            let index = Math.round(snappedAngle / 30) % 12;

            if (isInner) {
                val = index + 12;
                if (val === 24) val = 12; // 12 is usually at top in inner? 
                // Let's stick to my map: Inner 12-23. 
                // If index 0 (top) -> 12.
            } else {
                val = index;
                // if index 0 -> 0.
            }
        } else {
            // Minutes
            // Angle 0 = 0.
            // Angle 6 = 1.
            val = Math.round(snappedAngle / 6) % 60;
        }

        onChange(val);
    };

    // Calculate hand position
    let handAngle = 0;
    let isHandInner = false;

    if (mode === 'hours') {
        handAngle = (value % 12) * 30;
        isHandInner = value >= 12;
    } else {
        handAngle = value * 6;
    }

    const handLength = isHandInner ? radius * 0.65 : radius;

    return (
        <div
            className="clock-face"
            onMouseDown={handleMouseDown}
            style={{
                width: size, height: size,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                position: 'relative',
                cursor: 'pointer',
                touchAction: 'none'
            }}
        >
            {/* Center Dot */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
            }} />

            {/* Hand */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 2, height: handLength,
                backgroundColor: 'var(--accent)',
                transformOrigin: '50% 0%', // Rotate from top (which is center of clock)
                transform: `rotate(${handAngle - 180}deg)`, // -180 because we draw line upwards? No, height goes down.
                // Let's simplify:
                // height goes DOWN. So rotate 180 points UP.
                // If angle is 0 (top), we want rotation -180.
                zIndex: 5,
                pointerEvents: 'none'
            }}>
                {/* Hand Tip Circle */}
                <div style={{
                    position: 'absolute', bottom: -16, left: -15,
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    opacity: 0.2,
                    transform: 'translate(0, 0)'
                }} />
                <div style={{
                    position: 'absolute', bottom: -4, left: -4,
                    width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                }} />
            </div>

            {/* Numbers */}
            {numbers.map((num, i) => {
                const pos = getPosition(num.angle, num.isInner);
                const isSelected = num.value === value;
                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: pos.left, top: pos.top,
                            transform: 'translate(-50%, -50%)',
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                            color: isSelected ? 'white' : (num.isInner ? 'var(--text-muted)' : 'var(--text-primary)'),
                            fontSize: num.isInner ? '0.8rem' : '1rem',
                            fontWeight: 500,
                            pointerEvents: 'none',
                            zIndex: 10
                        }}
                    >
                        {num.label}
                    </div>
                );
            })}
        </div>
    );
};

export default MaterialTimePicker;
