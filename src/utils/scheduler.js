import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const generateSchedule = (missions, employees, startDate, endDate, currentSchedule = []) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const newSchedule = []; // We will append to this, or replace? Let's generate a fresh batch for the range.

    // Helper to check if employee is available on date
    const isAvailable = (employee, date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return employee.availability?.some(a => a.date === dateStr);
    };

    // Helper to check if employee has role
    const hasRole = (employee, role) => {
        return employee.roles.includes(role);
    };

    // Track load (assignments count) to balance distribution
    // Initialize with current schedule load if we want to balance across history, 
    // but for now let's balance within this generation batch + existing history if passed.
    const employeeLoad = {};
    employees.forEach(e => employeeLoad[e.id] = 0);

    // Calculate existing load from currentSchedule (if any)
    currentSchedule.forEach(s => {
        if (employeeLoad[s.employeeId] !== undefined) {
            employeeLoad[s.employeeId]++;
        }
    });

    // Iterate days
    days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');

        // Iterate missions
        // Sort missions by difficulty? (e.g. most requirements first). For now, simple order.
        // Filter out disabled missions (treat undefined as enabled for backward compatibility)
        const activeMissions = missions.filter(m => m.enabled !== false);

        activeMissions.forEach(mission => {

            // Iterate requirements
            mission.requirements.forEach(req => {
                const { role, count } = req;

                for (let i = 0; i < count; i++) {
                    // Find candidates
                    const candidates = employees.filter(e => {
                        // 1. Has role
                        if (!hasRole(e, role)) return false;
                        // 2. Is available
                        if (!isAvailable(e, day)) return false;
                        // 3. Not already assigned at this time (Simplified: Not assigned to ANY mission this day? 
                        //    Or check time overlap? Let's check if already assigned to THIS mission or ANY mission on this day for simplicity first.
                        //    User might want multiple missions per day if times don't overlap.
                        //    Let's assume 1 shift per day per employee for "Equal distribution" goal usually implies 1 shift/day.
                        //    But let's check time overlap to be correct.)

                        // Check if already assigned on this day in newSchedule
                        const assignedToday = newSchedule.find(s => s.employeeId === e.id && s.date === dateStr);
                        if (assignedToday) {
                            // Check overlap
                            // We need mission times.
                            // assignedToday.missionId -> get mission -> check times.
                            // For now, let's enforce 1 shift per day to ensure spread.
                            return false;
                        }
                        return true;
                    });

                    // Sort by load (ascending) -> Random tie-breaker
                    candidates.sort((a, b) => {
                        if (employeeLoad[a.id] !== employeeLoad[b.id]) {
                            return employeeLoad[a.id] - employeeLoad[b.id];
                        }
                        return 0.5 - Math.random();
                    });

                    if (candidates.length > 0) {
                        const chosen = candidates[0];

                        // Assign
                        newSchedule.push({
                            id: uuidv4(),
                            date: dateStr,
                            missionId: mission.id,
                            employeeId: chosen.id,
                            role: role,
                            missionName: mission.name, // Snapshot name
                            start: mission.start,
                            end: mission.end
                        });

                        // Increment load
                        employeeLoad[chosen.id]++;
                    } else {
                        // Unfilled slot
                        newSchedule.push({
                            id: uuidv4(),
                            date: dateStr,
                            missionId: mission.id,
                            employeeId: null, // Unassigned
                            role: role,
                            missionName: mission.name,
                            start: mission.start,
                            end: mission.end
                        });
                    }
                }
            });
        });
    });

    return newSchedule;
};
