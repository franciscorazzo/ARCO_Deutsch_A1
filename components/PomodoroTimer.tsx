import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayIcon, PauseIcon, PomodoroResetIcon } from './icons';

const useAudioAlert = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    const playSound = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
                return;
            }
        }
        const context = audioContextRef.current;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note
        gainNode.gain.setValueAtTime(0.6, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 1);
    }, []);

    return playSound;
};


export const PomodoroTimer: React.FC = () => {
    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [timeRemaining, setTimeRemaining] = useState(focusDuration * 60);
    const [isActive, setIsActive] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const playAlertSound = useAudioAlert();

    useEffect(() => {
        setTimeRemaining((mode === 'focus' ? focusDuration : breakDuration) * 60);
        setIsActive(false);
    }, [focusDuration, breakDuration]);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive]);

    useEffect(() => {
        if (timeRemaining < 0) {
            playAlertSound();
            const newMode = mode === 'focus' ? 'break' : 'focus';
            setMode(newMode);
            setTimeRemaining((newMode === 'focus' ? focusDuration : breakDuration) * 60);
            setIsActive(true); // Auto-start next session
        }
    }, [timeRemaining, mode, playAlertSound, focusDuration, breakDuration]);
    
    const resetTimerForMode = (newMode: 'focus' | 'break') => {
        setIsActive(false);
        setMode(newMode);
        setTimeRemaining((newMode === 'focus' ? focusDuration : breakDuration) * 60);
    }

    const handleModeChange = (newMode: 'focus' | 'break') => {
        if(isActive && newMode !== mode) {
            if(window.confirm('O timer está rodando. Deseja parar e trocar o modo?')) {
                resetTimerForMode(newMode);
            }
        } else {
            resetTimerForMode(newMode);
        }
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeRemaining((mode === 'focus' ? focusDuration : breakDuration) * 60);
    };

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const totalDuration = (mode === 'focus' ? focusDuration : breakDuration) * 60;
    const progressPercentage = totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
            <h2 className="text-lg font-bold text-center text-gray-800">Relógio Pomodoro</h2>
            
             <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                 <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle 
                        className={mode === 'focus' ? "text-red-600" : "text-yellow-400"}
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={(2 * Math.PI * 45) * (1 - progressPercentage / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold tracking-tighter">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                </div>
            </div>

            <div className="flex justify-center gap-2">
                <button onClick={() => handleModeChange('focus')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${mode === 'focus' ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Foco</button>
                <button onClick={() => handleModeChange('break')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${mode === 'break' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Pausa</button>
            </div>
            
            <div className="flex justify-center gap-2">
                 <button 
                    onClick={() => setIsActive(!isActive)} 
                    className={`w-24 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        isActive 
                        ? 'bg-yellow-500 hover:bg-yellow-600' 
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                >
                    {isActive ? <><PauseIcon /> Pausa</> : <><PlayIcon /> Iniciar</>}
                </button>
                <button 
                    onClick={handleReset} 
                    className="w-24 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                    <PomodoroResetIcon /> Reset
                </button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 pt-2">
                <div>
                    <label htmlFor="focus-duration" className="block text-xs font-medium text-gray-600">Foco (min)</label>
                    <input 
                        id="focus-duration"
                        type="number"
                        value={focusDuration}
                        onChange={(e) => setFocusDuration(Math.max(1, Number(e.target.value)))}
                        className="w-full mt-1 p-1.5 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                        disabled={isActive}
                    />
                </div>
                <div>
                    <label htmlFor="break-duration" className="block text-xs font-medium text-gray-600">Pausa (min)</label>
                    <input 
                        id="break-duration"
                        type="number"
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(Math.max(1, Number(e.target.value)))}
                        className="w-full mt-1 p-1.5 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500"
                        disabled={isActive}
                    />
                </div>
            </div>

        </div>
    );
};
