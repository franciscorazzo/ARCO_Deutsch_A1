import React, { useState, useMemo } from 'react';
import type { LessonData } from '../types';
import { CheckCircleIcon, ArrowDownIcon, LockIcon } from './icons';
import { ModuleTest } from './ModuleTest';

interface TaskItemProps {
    id: string;
    label: string;
    xp: number;
    isChecked: boolean;
    onToggle: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({ id, label, xp, isChecked, onToggle }) => {
    return (
        <div id={id} className={`flex items-center p-3 rounded-md transition-all duration-300 ${isChecked ? 'bg-green-50 text-gray-500' : 'bg-white'}`}>
            <input
                type="checkbox"
                id={`task-${id}`}
                checked={isChecked}
                onChange={() => onToggle(id)}
                className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <label htmlFor={`task-${id}`} className="ml-3 flex-grow cursor-pointer">
                {isChecked ? <s>{label}</s> : label}
            </label>
            <span className={`font-semibold text-sm px-2 py-1 rounded-full ${isChecked ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                +{xp} XP
            </span>
        </div>
    );
});

interface LessonAccordionProps {
    lessons: LessonData[];
    completedTasks: Set<string>;
    onToggleTask: (taskId: string) => void;
    moduleGrades: { [key: string]: number };
    onSaveGrade: (lessonId: number, grade: number) => void;
}

export const LessonAccordion: React.FC<LessonAccordionProps> = ({ lessons, completedTasks, onToggleTask, moduleGrades, onSaveGrade }) => {
    const [openLesson, setOpenLesson] = useState<number | null>(1);

    const lessonCompletionStatus = useMemo(() => {
        return lessons.map(lesson => {
            const allLessonTasks = [
                ...lesson.sections.flatMap(s => s.tasks),
                ...(lesson.conviverTask ? [lesson.conviverTask] : [])
            ];
            return allLessonTasks.every(task => completedTasks.has(task.id));
        });
    }, [lessons, completedTasks]);


    const toggleLesson = (lessonId: number) => {
        setOpenLesson(prevOpen => (prevOpen === lessonId ? null : lessonId));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Missões por Lição (Lektion 1-24)</h2>
            <div className="space-y-2">
                {lessons.map((lesson, index) => {
                    const isOpen = openLesson === lesson.id;
                    const isLessonComplete = lessonCompletionStatus[index];
                    const isLocked = index > 0 && !lessonCompletionStatus[index - 1];
                    const arePrereqsComplete = lesson.sections.flatMap(s => s.tasks).every(task => completedTasks.has(task.id));
                    const isConviverTaskComplete = lesson.conviverTask && completedTasks.has(lesson.conviverTask.id);

                    return (
                        <React.Fragment key={lesson.id}>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleLesson(lesson.id)}
                                    disabled={isLocked}
                                    className={`w-full flex justify-between items-center p-4 text-left focus:outline-none transition-colors ${
                                        isLocked 
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                            {isLessonComplete && <CheckCircleIcon />}
                                        </div>
                                        <span className="font-semibold text-lg">{lesson.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isLocked && <span className="text-sm font-normal text-gray-600 hidden sm:inline">Complete para desbloquear</span>}
                                        {isLocked ? <LockIcon /> : <ArrowDownIcon isOpen={isOpen} />}
                                    </div>
                                </button>
                                {isOpen && !isLocked && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {lesson.sections.map(section => (
                                                <div key={section.title}>
                                                    <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-3">{section.title}</h3>
                                                    <div className="space-y-2">
                                                        {section.tasks.map(task => (
                                                            <TaskItem
                                                                key={task.id}
                                                                id={task.id}
                                                                label={task.label}
                                                                xp={task.xp}
                                                                isChecked={completedTasks.has(task.id)}
                                                                onToggle={onToggleTask}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {lesson.conviverTask && (
                                            <div className="mt-6 border-t pt-4">
                                                 <button
                                                    onClick={() => onToggleTask(lesson.conviverTask!.id)}
                                                    disabled={!arePrereqsComplete && !isConviverTaskComplete}
                                                    className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 ${
                                                        isConviverTaskComplete 
                                                            ? 'bg-yellow-500 text-white' 
                                                            : arePrereqsComplete 
                                                                ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' 
                                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isConviverTaskComplete
                                                        ? 'Voltar'
                                                        : arePrereqsComplete
                                                            ? 'Avançar'
                                                            : 'Complete Aprender/Repetir para desbloquear'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                             {lesson.id % 3 === 0 && (
                                <ModuleTest
                                    lessonId={lesson.id}
                                    isUnlocked={isLessonComplete}
                                    savedGrade={moduleGrades[`module-${lesson.id}`]}
                                    onSaveGrade={onSaveGrade}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};