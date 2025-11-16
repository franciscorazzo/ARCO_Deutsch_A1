import React from 'react';
import { Modal } from './Modal';
import { TargetIcon, WhatsAppIcon } from './icons';
import type { DailyMission } from '../types';

interface DailyMissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    mission: DailyMission | null;
}

export const DailyMissionModal: React.FC<DailyMissionModalProps> = ({ isOpen, onClose, mission }) => {
    
    const missionTypeColors: { [key in DailyMission['type']]: string } = {
        LER: 'border-blue-500 text-blue-700 bg-blue-100',
        ESCREVER: 'border-green-500 text-green-700 bg-green-100',
        FALAR: 'border-purple-500 text-purple-700 bg-purple-100',
        COMPLETAR: 'border-yellow-500 text-yellow-700 bg-yellow-100',
        VOCABULÁRIO: 'border-red-500 text-red-700 bg-red-100',
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Desafio Rápido">
            {mission ? (
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                        <TargetIcon />
                    </div>
                    <div className="mt-2 px-7 py-3">
                         <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${missionTypeColors[mission.type]}`}>
                            {mission.type}
                        </span>
                        <p className="text-2xl font-semibold text-gray-800 mt-4">{mission.prompt}</p>
                    </div>
                    <div className="items-center px-4 py-3 mt-4 flex flex-wrap justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                        >
                            Missão Cumprida!
                        </button>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Meu desafio de alemão de hoje é: "${mission.prompt}" 🇩🇪 #ARCODeutsch`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#25D366] text-base font-medium text-white hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                        >
                            <WhatsAppIcon />
                            <span>Compartilhar</span>
                        </a>
                    </div>
                </div>
            ) : (
                 <div className="text-center p-8">
                    <p className="text-gray-500">Carregando missão...</p>
                </div>
            )}
        </Modal>
    );
};