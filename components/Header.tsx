import React, { useRef } from 'react';
import { MissionIcon, ImportIcon, ExportIcon, ResetIcon, QuestionMarkCircleIcon } from './icons';

interface HeaderProps {
    onOpenHelp: () => void;
    onDailyMission: () => void;
    onImportJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onExportJson: () => void;
    onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    onOpenHelp,
    onDailyMission,
    onImportJson,
    onExportJson,
    onResetProgress,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleResetClick = () => {
        if (window.confirm('Tem certeza que deseja resetar todo o seu progresso? Esta ação não pode ser desfeita.')) {
            onResetProgress();
        }
    };
    
    const buttonBaseClasses = "flex items-center justify-center gap-2 font-bold rounded-lg transition-colors duration-200 p-2 sm:py-2 sm:px-4";

    return (
        <header className="bg-yellow-400 text-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
                    <div className="flex-grow text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900">Total Deutsch | ARCO A1</h1>
                        <p className="text-sm text-gray-700 font-medium">Aprender • Repetir • Conviver</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onImportJson}
                            accept=".json"
                            className="hidden"
                        />
                        <button onClick={onOpenHelp} className={`${buttonBaseClasses} bg-blue-600 hover:bg-blue-700 text-white`}>
                           <QuestionMarkCircleIcon /> <span className="hidden sm:inline">Ajuda</span>
                        </button>
                        <button onClick={onDailyMission} className={`${buttonBaseClasses} bg-purple-600 hover:bg-purple-700 text-white`}>
                           <MissionIcon /> <span className="hidden sm:inline">Missão do dia</span>
                        </button>
                        <button onClick={handleImportClick} className={`${buttonBaseClasses} bg-gray-800 hover:bg-gray-900 text-white`}>
                           <ImportIcon /> <span className="hidden sm:inline">Importar JSON</span>
                        </button>
                        <button onClick={onExportJson} className={`${buttonBaseClasses} bg-white hover:bg-gray-200 text-gray-900`}>
                            <ExportIcon /> <span className="hidden sm:inline">Exportar JSON</span>
                        </button>
                         <button onClick={handleResetClick} className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700 text-white`}>
                            <ResetIcon /> <span className="hidden sm:inline">Resetar progresso</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
