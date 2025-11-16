import React, { useState } from 'react';
import { Modal } from './Modal';
import { ClassroomGuide } from './ClassroomGuide';

const StudentGuide: React.FC = () => (
    <div className="space-y-4 text-gray-600">
        <h3 className="text-lg font-semibold text-gray-800">Como funciona o App</h3>
        <ol className="list-decimal list-inside space-y-3">
            <li><strong>Comece:</strong> Preencha seu nome em "Seu Progresso" para iniciar sua jornada.</li>
            <li><strong>Acompanhe o Progresso:</strong> Marque as tarefas de cada lição (Lektion) para ganhar XP e ver seu avanço.</li>
            <li><strong>Faça Testes:</strong> Ao final de cada 3 lições, um teste de módulo será desbloqueado. Insira sua nota para calcular sua média.</li>
            <li><strong>Desafio Diário:</strong> Use "Missão do dia" para um exercício rápido e prático.</li>
            <li><strong>Foco Total:</strong> O "Relógio Pomodoro" ajuda a gerenciar seu tempo de estudo com sessões de foco e pausas.</li>
            <li><strong>Links Úteis:</strong> Salve links importantes, como dicionários ou sites de exercícios, na seção "Meus Links Úteis".</li>
            <li><strong>Salve e Restaure:</strong> Para trocar de dispositivo, use "Exportar JSON" para salvar seu progresso e "Importar JSON" no novo aparelho.</li>
            <li><strong>Recomeçar:</strong> Se precisar, use "Resetar progresso" para limpar todos os dados e começar de novo (cuidado, esta ação é irreversível!).</li>
        </ol>
    </div>
);

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Guia de Ajuda">
            <div className="prose max-w-none">
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('student')}
                            className={`${
                                activeTab === 'student'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                        >
                            Guia do Aluno
                        </button>
                        <button
                            onClick={() => setActiveTab('teacher')}
                            className={`${
                                activeTab === 'teacher'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                        >
                            Guia do Professor
                        </button>
                    </nav>
                </div>
                {activeTab === 'student' && <StudentGuide />}
                {activeTab === 'teacher' && <ClassroomGuide />}
            </div>
        </Modal>
    );
};