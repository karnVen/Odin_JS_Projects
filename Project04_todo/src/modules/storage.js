// localStorage can only hold JSON, so when we retrieve data we get plain objects.
// The revive functions below reconstruct our actual class instances so methods still work.

import Todo from './todo.js';
import Project from './project.js';

const PROJECTS_KEY = 'taskflow_projects';
const ACTIVE_KEY   = 'taskflow_active_project';

function saveProjects(projects) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    // Could fail if storage is full or in a private browsing mode that blocks writes
    console.warn('Could not save to localStorage:', err);
  }
}

function loadProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Rebuild each Project and its nested Todo instances from plain data
    return parsed.map((projData) => {
      const project = Object.assign(new Project(projData.name), projData);
      project.todos = (projData.todos || []).map(
        (todoData) => Object.assign(new Todo(todoData), todoData)
      );
      return project;
    });
  } catch (err) {
    console.warn('Could not load from localStorage — starting fresh:', err);
    return null;
  }
}

function saveActiveProject(projectId) {
  localStorage.setItem(ACTIVE_KEY, projectId);
}

function loadActiveProject() {
  return localStorage.getItem(ACTIVE_KEY);
}

export { saveProjects, loadProjects, saveActiveProject, loadActiveProject };
