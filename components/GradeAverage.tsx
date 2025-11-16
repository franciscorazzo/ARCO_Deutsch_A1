import React from 'react';
import { GradeAverageIcon } from './icons';

interface GradeAverageProps {
    average: number;
    count: number;
}

export const GradeAverage: React.FC<GradeAverageProps> = ({ average, count }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Média dos Módulos</h2>
            {count > 0 ? (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-blue-500 p-3 rounded-full">
                        <GradeAverageIcon />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-blue-600">{average.toFixed(1)}</p>
                        <p className="text-sm text-gray-500">Média de {count} teste{count > 1 ? 's' : ''}</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Nenhuma nota de módulo foi registrada ainda. Complete as lições de um módulo para registrar sua primeira nota.</p>
            )}
        </div>
    );
};