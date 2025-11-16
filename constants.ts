import type { LessonData } from './types';

export const TOTAL_LESSONS = 24;

const generateTasksForLesson = (lessonId: number) => ({
    aprender: [
        { id: `l${lessonId}-hlv`, label: 'Shadowing', xp: 5, categoryKey: 'hlv' },
        { id: `l${lessonId}-sprechen`, label: 'Sprechen (fala)', xp: 10, categoryKey: 'sprechen' },
        { id: `l${lessonId}-schreiben`, label: 'Schreiben (texto)', xp: 10, categoryKey: 'schreiben' },
        { id: `l${lessonId}-teste`, label: 'Teste', xp: 15, categoryKey: 'sprechen' },
    ],
    repetir: [
        { id: `l${lessonId}-rev24`, label: 'Revisão 24h', xp: 5, categoryKey: 'repetir' },
        { id: `l${lessonId}-rev7`, label: 'Revisão 7 dias', xp: 5, categoryKey: 'repetir' },
    ],
    conviver: { id: `l${lessonId}-conviver`, label: 'Avançar', xp: 20, categoryKey: 'kultur' }
});


export const LESSONS_DATA: LessonData[] = Array.from({ length: TOTAL_LESSONS }, (_, i) => {
    const lessonId = i + 1;
    const tasks = generateTasksForLesson(lessonId);
    return {
        id: lessonId,
        title: `Lektion ${lessonId}`,
        sections: [
            { title: 'APRENDER', tasks: tasks.aprender },
            { title: 'REPETIR', tasks: tasks.repetir },
        ],
        conviverTask: tasks.conviver,
    };
});