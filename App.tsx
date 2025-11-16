import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ProgressSummary } from './components/ProgressSummary';
import { LessonAccordion } from './components/LessonAccordion';
import { PomodoroTimer } from './components/PomodoroTimer';
import { DailyMissionModal } from './components/DailyMissionModal';
import { LESSONS_DATA, TOTAL_LESSONS } from './constants';
import { MISSIONS } from './missions';
import type { ProgressState, Task, LessonSection, DailyMission, UsefulLink } from './types';
import { HelpModal } from './components/HelpModal';
import { UsefulLinks } from './components/UsefulLinks';

const App: React.FC = () => {
    const getInitialState = (): ProgressState => {
        try {
            const savedState = localStorage.getItem('arcoDeutschProgress');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                return {
                    ...parsed,
                    completedTasks: new Set<string>(parsed.completedTasks || []),
                    moduleGrades: parsed.moduleGrades || {},
                    usefulLinks: parsed.usefulLinks || [],
                };
            }
        } catch (error) {
            console.error("Failed to parse progress from localStorage", error);
        }
        return {
            name: '',
            completedTasks: new Set<string>(),
            moduleGrades: {},
            usefulLinks: [],
        };
    };

    const [progress, setProgress] = useState<ProgressState>(getInitialState);
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [dailyMission, setDailyMission] = useState<DailyMission | null>(null);


    useEffect(() => {
        try {
            const stateToSave = {
                ...progress,
                completedTasks: Array.from(progress.completedTasks),
            };
            localStorage.setItem('arcoDeutschProgress', JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
    }, [progress]);

    const allTasks = useMemo(() => {
        const tasks: Task[] = [];
        LESSONS_DATA.forEach(lesson => {
            lesson.sections.forEach(section => {
                tasks.push(...section.tasks);
            });
            if (lesson.conviverTask) {
                tasks.push(lesson.conviverTask);
            }
        });
        return tasks;
    }, []);

    const calculations = useMemo(() => {
        let totalXp = 0;
        const taskMap = new Map<string, Task>(allTasks.map(t => [t.id, t]));

        progress.completedTasks.forEach(taskId => {
            const task = taskMap.get(taskId);
            if (task) {
                totalXp += task.xp;
            }
        });

        const completedLessons = new Set<number>();
        LESSONS_DATA.forEach(lesson => {
            const lessonTasks = [
                ...lesson.sections.flatMap(s => s.tasks),
                ...(lesson.conviverTask ? [lesson.conviverTask] : [])
            ];
            const allLessonTasksCompleted = lessonTasks.every(t => progress.completedTasks.has(t.id));
            if (allLessonTasksCompleted) {
                completedLessons.add(lesson.id);
            }
        });

        const grades = Object.values(progress.moduleGrades);
        const testsTaken = grades.length;
        let gradeAverage = 0;
        if (testsTaken > 0) {
            // FIX: The original reduce function could have faulty type inference when dealing with
            // mixed data types from JSON. Using `map` to sanitize the data into an array of
            // numbers first makes the subsequent `reduce` for summation type-safe and robust.
            const sum = grades.map(grade => Number(grade) || 0).reduce((acc, grade) => acc + grade, 0);
            gradeAverage = sum / testsTaken;
        }

        return { totalXp, completedLessonsCount: completedLessons.size, gradeAverage, testsTaken };
    }, [progress.completedTasks, progress.moduleGrades, allTasks]);
    
    const handleNameChange = (name: string) => {
        setProgress(p => ({ ...p, name }));
    };

    const handleToggleTask = useCallback((taskId: string) => {
        setProgress(p => {
            const newCompletedTasks = new Set(p.completedTasks);
            if (newCompletedTasks.has(taskId)) {
                newCompletedTasks.delete(taskId);
            } else {
                newCompletedTasks.add(taskId);
            }
            return { ...p, completedTasks: newCompletedTasks };
        });
    }, []);

    const handleExportJson = () => {
        const dataStr = JSON.stringify({
            ...progress,
            completedTasks: Array.from(progress.completedTasks),
        }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `arco_deutsch_progress_${progress.name || 'aluno'}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const importedState = JSON.parse(text);
                    if (importedState.name !== undefined && importedState.completedTasks !== undefined) {
                        setProgress({
                            name: importedState.name,
                            completedTasks: new Set<string>(importedState.completedTasks),
                            moduleGrades: importedState.moduleGrades || {},
                            usefulLinks: importedState.usefulLinks || []
                        });
                        alert('Progresso importado com sucesso!');
                    } else {
                        throw new Error('Invalid JSON structure');
                    }
                }
            } catch (error) {
                alert('Erro ao importar o arquivo. Verifique se o arquivo JSON é válido.');
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    };
    
    const handleResetProgress = useCallback(() => {
        try {
            localStorage.removeItem('arcoDeutschProgress');
            setProgress({
                name: '',
                completedTasks: new Set<string>(),
                moduleGrades: {},
                usefulLinks: []
            });
        } catch (error) {
            console.error("Failed to reset progress", error);
        }
    }, []);

    const handleDailyMission = () => {
        const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
        setDailyMission(randomMission);
        setIsMissionModalOpen(true);
    };

    const handleSaveGrade = useCallback((lessonId: number, grade: number) => {
        setProgress(p => {
            const newModuleGrades = { ...p.moduleGrades, [`module-${lessonId}`]: grade };
            return { ...p, moduleGrades: newModuleGrades };
        });
    }, []);

    const handleAddLink = useCallback((title: string, url: string) => {
        setProgress(p => ({
            ...p,
            usefulLinks: [
                ...p.usefulLinks,
                { id: `link-${Date.now()}`, title, url }
            ]
        }));
    }, []);

    const handleDeleteLink = useCallback((linkId: string) => {
        setProgress(p => ({
            ...p,
            usefulLinks: p.usefulLinks.filter(link => link.id !== linkId)
        }));
    }, []);


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm shadow-sm">
                <Header
                    onOpenHelp={() => setIsHelpModalOpen(true)}
                    onDailyMission={handleDailyMission}
                    onImportJson={handleImportJson}
                    onExportJson={handleExportJson}
                    onResetProgress={handleResetProgress}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Progress Summary + Lessons */}
                <div className="lg:col-span-2 space-y-8 pt-2 lg:pt-8">
                    <div className="sticky top-[112px] sm:top-[88px] z-20">
                        <ProgressSummary
                            name={progress.name}
                            onNameChange={handleNameChange}
                            xp={calculations.totalXp}
                            completedLessons={calculations.completedLessonsCount}
                            totalLessons={TOTAL_LESSONS}
                            gradeAverage={calculations.gradeAverage}
                            testsTaken={calculations.testsTaken}
                        />
                    </div>
                    <main>
                        <LessonAccordion
                            lessons={LESSONS_DATA}
                            completedTasks={progress.completedTasks}
                            onToggleTask={handleToggleTask}
                            moduleGrades={progress.moduleGrades}
                            onSaveGrade={handleSaveGrade}
                        />
                    </main>
                </div>

                {/* Right Column: Pomodoro Timer (Sticky) */}
                <div className="lg:col-span-1 pt-8">
                    <div className="sticky top-[88px] z-20 space-y-8">
                        <PomodoroTimer />
                        <UsefulLinks 
                            links={progress.usefulLinks}
                            onAddLink={handleAddLink}
                            onDeleteLink={handleDeleteLink}
                        />
                    </div>
                </div>
            </div>
            
            <DailyMissionModal
                isOpen={isMissionModalOpen}
                onClose={() => setIsMissionModalOpen(false)}
                mission={dailyMission}
            />
            <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />

        </div>
    );
};

export default App;
