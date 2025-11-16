import React, { useState, useEffect } from 'react';

interface ProgressSummaryProps {
    name: string;
    onNameChange: (name: string) => void;
    xp: number;
    completedLessons: number;
    totalLessons: number;
    gradeAverage: number;
    testsTaken: number;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({
    name,
    onNameChange,
    xp,
    completedLessons,
    totalLessons,
    gradeAverage,
    testsTaken
}) => {
    const [localName, setLocalName] = useState('');

    useEffect(() => {
        if (!name) {
            setLocalName('');
        }
    }, [name]);

    const handleSave = () => {
        if (localName.trim()) {
            onNameChange(localName.trim());
        }
    };

    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const levelLabel = completedLessons >= 12 ? 'A1.2' : 'A1.1';

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            {/* Greeting / Name Input Section */}
            <div>
                {name ? (
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Hallo, <span className="text-red-700">{name}</span>!</h2>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-2">Seu Progresso</h2>
                        <div className="flex flex-wrap items-center gap-2">
                            <label htmlFor="student-name" className="font-semibold sr-only">Seu nome:</label>
                            <input
                                id="student-name"
                                type="text"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                placeholder="Digite seu nome para começar"
                                className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSave}
                                disabled={!localName.trim()}
                                className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Salvar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Stats Section */}
            <div className="space-y-3">
                <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
                    <div className="py-0 sm:py-1 px-2">
                        <p className="text-xl sm:text-3xl font-bold text-red-600">{xp}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">XP • {levelLabel}</p>
                    </div>
                    <div className="py-0 sm:py-1 px-2">
                        {testsTaken > 0 ? (
                            <>
                                <p className="text-xl sm:text-3xl font-bold text-blue-600">{gradeAverage.toFixed(1)}</p>
                                <p className="text-xs sm:text-sm text-gray-500">Média</p>
                            </>
                        ) : (
                            <>
                                <p className="text-xl sm:text-3xl font-bold text-gray-400">-</p>
                                <p className="text-xs sm:text-sm text-gray-500">Média</p>
                            </>
                        )}
                    </div>
                    <div className="py-0 sm:py-1 px-2">
                        <p className="text-xl sm:text-3xl font-bold text-gray-800">{completedLessons} / {totalLessons}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Lições</p>
                    </div>
                </div>
                <div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner overflow-hidden">
                        <div
                            className="h-2.5 rounded-full"
                            style={{
                                width: `${progressPercentage}%`,
                                backgroundImage: 'linear-gradient(to right, #000000, #DD0000, #FFCE00)',
                                transition: 'width 0.5s ease-in-out'
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};