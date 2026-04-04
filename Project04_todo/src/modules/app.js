// AppController is the brain of the app. It knows nothing about the DOM.
// Every state change goes through here, and it persists data after each change.

import Todo from './todo.js';
import Project from './project.js';
import { saveProjects, loadProjects, saveActiveProject, loadActiveProject } from './storage.js';

class AppController {
  constructor() {
    this.projects = [];
    this.activeProjectId = null;

    this._bootstrap();
  }

  // Load saved data or set up a sensible default state
  _bootstrap() {
    const saved = loadProjects();

    if (saved && saved.length > 0) {
      this.projects = saved;

      const lastActiveId = loadActiveProject();
      const lastActiveStillExists = lastActiveId && this.getProject(lastActiveId);
      this.activeProjectId = lastActiveStillExists ? lastActiveId : this.projects[0].id;
    } else {
      // First run — create a default project with a couple of sample todos
      const inbox = new Project('Inbox');

      inbox.addTodo(new Todo({
        title: 'Welcome to Taskflow!',
        description: 'This is a sample task. Click it to expand, or hit edit to change details.',
        dueDate: '',
        priority: 'low',
        notes: 'You can add notes to any task.',
      }));

      inbox.addTodo(new Todo({
        title: 'Build your first project',
        description: 'Hit the + button in the sidebar to create a new project.',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        priority: 'high',
        notes: '',
      }));

      this.projects.push(inbox);
      this.activeProjectId = inbox.id;
      this._persist();
    }
  }

  _persist() {
    saveProjects(this.projects);
    saveActiveProject(this.activeProjectId);
  }

  // — Project operations —

  getProject(id) {
    return this.projects.find((p) => p.id === id) || null;
  }

  getActiveProject() {
    return this.getProject(this.activeProjectId);
  }

  setActiveProject(id) {
    if (!this.getProject(id)) return false;
    this.activeProjectId = id;
    this._persist();
    return true;
  }

  addProject(name) {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const project = new Project(trimmed);
    this.projects.push(project);
    this._persist();
    return project;
  }

  deleteProject(id) {
    // Never delete the last project — the app needs at least one
    if (this.projects.length <= 1) return false;

    this.projects = this.projects.filter((p) => p.id !== id);

    if (this.activeProjectId === id) {
      this.activeProjectId = this.projects[0].id;
    }

    this._persist();
    return true;
  }

  // — Todo operations —

  addTodo(projectId, todoData) {
    const project = this.getProject(projectId);
    if (!project) return null;

    const todo = new Todo(todoData);
    project.addTodo(todo);
    this._persist();
    return todo;
  }

  updateTodo(projectId, todoId, data) {
    const project = this.getProject(projectId);
    if (!project) return false;

    const todo = project.getTodo(todoId);
    if (!todo) return false;

    todo.update(data);
    this._persist();
    return true;
  }

  deleteTodo(projectId, todoId) {
    const project = this.getProject(projectId);
    if (!project) return false;

    project.removeTodo(todoId);
    this._persist();
    return true;
  }

  toggleTodo(projectId, todoId) {
    const project = this.getProject(projectId);
    if (!project) return false;

    const todo = project.getTodo(todoId);
    if (!todo) return false;

    todo.toggleComplete();
    this._persist();
    return todo.completed;
  }
}

export default AppController;
