import { Project } from './project.js';

export const saveToLocal = (projects) => {
    localStorage.setItem('todoApp', JSON.stringify(projects));
};

export const loadFromLocal = () => {
    const data = JSON.parse(localStorage.getItem('todoApp'));
    if (!data) return null;

    // Restore class methods lost during JSON stringify
    return data.map(projData => {
        const p = new Project(projData.name);
        p.todos = projData.todos;
        return p;
    });
};