// UIController owns all DOM work. It calls into AppController for data changes
// and then re-renders the relevant parts of the page.

import { format, isPast, isToday, parseISO } from 'date-fns';

class UIController {
  constructor(app) {
    this.app = app;
    this.expandedTodoId = null; // which todo has its detail panel open
    this.activeFilter = 'all';  // 'all' | 'high' | 'medium' | 'low' | 'completed'

    this._buildShell();
    this._bindGlobalEvents();
    this.render();
  }

  // Build the static page structure once
  _buildShell() {
    const root = document.getElementById('app');
    root.innerHTML = `
      <div class="app-layout">
        <aside class="sidebar">
          <div class="sidebar-brand">
            <span class="brand-icon">✦</span>
            <span class="brand-name">Taskflow</span>
          </div>

          <div class="sidebar-section-label">Projects</div>
          <ul class="project-list" id="project-list"></ul>

          <div class="add-project-area">
            <input
              type="text"
              id="new-project-input"
              class="new-project-input"
              placeholder="New project name…"
              maxlength="40"
            />
            <button class="btn-add-project" id="btn-add-project" aria-label="Add project">+</button>
          </div>
        </aside>

        <main class="main-content">
          <header class="content-header">
            <div class="header-left">
              <h1 class="project-title" id="project-title">—</h1>
              <span class="todo-count" id="todo-count"></span>
            </div>
            <button class="btn-primary" id="btn-new-todo">+ Add Task</button>
          </header>

          <div class="filter-bar" id="filter-bar">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="high">🔴 High</button>
            <button class="filter-btn" data-filter="medium">🟡 Medium</button>
            <button class="filter-btn" data-filter="low">🟢 Low</button>
            <button class="filter-btn" data-filter="completed">✓ Done</button>
          </div>

          <div class="todo-list" id="todo-list"></div>
        </main>
      </div>

      <!-- Modal overlay for add / edit -->
      <div class="modal-overlay hidden" id="modal-overlay">
        <div class="modal" id="todo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-header">
            <h2 class="modal-title" id="modal-title">New Task</h2>
            <button class="modal-close" id="modal-close" aria-label="Close">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="todo-title">Title *</label>
              <input type="text" id="todo-title" class="form-input" placeholder="What needs to be done?" maxlength="120" />
            </div>

            <div class="form-group">
              <label class="form-label" for="todo-description">Description</label>
              <textarea id="todo-description" class="form-input form-textarea" placeholder="Add some context…" rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="todo-due">Due Date</label>
                <input type="date" id="todo-due" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label" for="todo-priority">Priority</label>
                <select id="todo-priority" class="form-input form-select">
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="todo-notes">Notes</label>
              <textarea id="todo-notes" class="form-input form-textarea" placeholder="Any extra notes…" rows="2"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-ghost" id="btn-cancel-modal">Cancel</button>
            <button class="btn-primary" id="btn-save-todo">Save Task</button>
          </div>
        </div>
      </div>
    `;
  }

  _bindGlobalEvents() {
    // Sidebar: add project
    document.getElementById('btn-add-project').addEventListener('click', () => {
      this._handleAddProject();
    });

    document.getElementById('new-project-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._handleAddProject();
    });

    // Open modal for new todo
    document.getElementById('btn-new-todo').addEventListener('click', () => {
      this._openModal(null);
    });

    // Modal close buttons
    document.getElementById('modal-close').addEventListener('click', () => this._closeModal());
    document.getElementById('btn-cancel-modal').addEventListener('click', () => this._closeModal());
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-overlay')) this._closeModal();
    });

    // Modal save
    document.getElementById('btn-save-todo').addEventListener('click', () => this._handleSaveTodo());

    // Filter buttons
    document.getElementById('filter-bar').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      this.activeFilter = btn.dataset.filter;
      this._renderTodoList();
    });

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeModal();
    });
  }

  // — Rendering —

  render() {
    this._renderSidebar();
    this._renderTodoList();
  }

  _renderSidebar() {
    const list = document.getElementById('project-list');
    const { projects, activeProjectId } = this.app;

    list.innerHTML = projects
      .map((project) => {
        const isActive = project.id === activeProjectId;
        const remaining = project.todos.filter((t) => !t.completed).length;

        return `
          <li class="project-item ${isActive ? 'active' : ''}" data-project-id="${project.id}">
            <span class="project-item-name">${_escape(project.name)}</span>
            ${remaining > 0 ? `<span class="project-badge">${remaining}</span>` : ''}
            ${projects.length > 1
              ? `<button class="project-delete" data-delete-project="${project.id}" aria-label="Delete project">×</button>`
              : ''}
          </li>
        `;
      })
      .join('');

    // Bind project clicks
    list.querySelectorAll('.project-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        // Don't switch projects if the delete button was clicked
        if (e.target.closest('.project-delete')) return;

        const id = item.dataset.projectId;
        this.app.setActiveProject(id);
        this.expandedTodoId = null;
        this.activeFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');
        this.render();
      });
    });

    // Bind delete buttons
    list.querySelectorAll('.project-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.deleteProject;
        const project = this.app.getProject(id);
        if (!project) return;

        const confirmed = confirm(`Delete "${project.name}" and all its tasks?`);
        if (!confirmed) return;

        const deleted = this.app.deleteProject(id);
        if (deleted) {
          this.expandedTodoId = null;
          this.render();
        }
      });
    });
  }

  _renderTodoList() {
    const project = this.app.getActiveProject();
    if (!project) return;

    document.getElementById('project-title').textContent = project.name;

    const remaining = project.todos.filter((t) => !t.completed).length;
    const total = project.todos.length;
    document.getElementById('todo-count').textContent =
      total === 0 ? '' : `${remaining} of ${total} remaining`;

    const allTodos = project.getSortedTodos();
    const visible = this._applyFilter(allTodos);

    const container = document.getElementById('todo-list');

    if (visible.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">◎</div>
          <p class="empty-title">${total === 0 ? 'No tasks yet' : 'Nothing matches this filter'}</p>
          <p class="empty-sub">${total === 0 ? 'Hit "+ Add Task" to get started.' : 'Try a different filter.'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = visible
      .map((todo) => this._buildTodoCard(todo, project.id))
      .join('');

    // Bind all interactive elements inside the list
    this._bindTodoListEvents(container, project.id);
  }

  _applyFilter(todos) {
    switch (this.activeFilter) {
      case 'high':      return todos.filter((t) => !t.completed && t.priority === 'high');
      case 'medium':    return todos.filter((t) => !t.completed && t.priority === 'medium');
      case 'low':       return todos.filter((t) => !t.completed && t.priority === 'low');
      case 'completed': return todos.filter((t) => t.completed);
      default:          return todos; // 'all'
    }
  }

  _buildTodoCard(todo, projectId) {
    const isExpanded = this.expandedTodoId === todo.id;
    const dueDateLabel = _formatDueDate(todo.dueDate);
    const isOverdue = _isOverdue(todo.dueDate) && !todo.completed;

    return `
      <div class="todo-card ${todo.completed ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}"
           data-todo-id="${todo.id}" data-project-id="${projectId}">

        <div class="todo-card-main">
          <button
            class="todo-checkbox ${todo.completed ? 'checked' : ''}"
            data-action="toggle"
            data-todo-id="${todo.id}"
            aria-label="Toggle complete"
          >
            ${todo.completed ? '✓' : ''}
          </button>

          <div class="todo-info" data-action="expand" data-todo-id="${todo.id}">
            <span class="todo-title">${_escape(todo.title)}</span>
            <div class="todo-meta">
              <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
              ${dueDateLabel
                ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">${dueDateLabel}</span>`
                : ''}
            </div>
          </div>

          <div class="todo-actions">
            <button class="action-btn" data-action="edit" data-todo-id="${todo.id}" aria-label="Edit task">✎</button>
            <button class="action-btn action-btn-danger" data-action="delete" data-todo-id="${todo.id}" aria-label="Delete task">⌫</button>
          </div>
        </div>

        ${isExpanded ? `
          <div class="todo-detail">
            ${todo.description ? `<p class="detail-field"><span class="detail-label">Description</span>${_escape(todo.description)}</p>` : ''}
            ${todo.dueDate    ? `<p class="detail-field"><span class="detail-label">Due Date</span>${_escape(todo.dueDate)}</p>` : ''}
            ${todo.notes      ? `<p class="detail-field"><span class="detail-label">Notes</span>${_escape(todo.notes)}</p>` : ''}
            ${!todo.description && !todo.dueDate && !todo.notes
              ? '<p class="detail-empty">No extra details. Hit edit to add some.</p>' : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  _bindTodoListEvents(container, projectId) {
    container.querySelectorAll('[data-action]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const action  = el.dataset.action;
        const todoId  = el.dataset.todoId;
        const project = this.app.getProject(projectId);
        if (!project) return;

        if (action === 'toggle') {
          this.app.toggleTodo(projectId, todoId);
          this.render();
        }

        if (action === 'expand') {
          this.expandedTodoId = this.expandedTodoId === todoId ? null : todoId;
          this._renderTodoList();
        }

        if (action === 'edit') {
          const todo = project.getTodo(todoId);
          if (todo) this._openModal(todo, projectId);
        }

        if (action === 'delete') {
          const todo = project.getTodo(todoId);
          if (!todo) return;
          const confirmed = confirm(`Delete "${todo.title}"?`);
          if (!confirmed) return;
          if (this.expandedTodoId === todoId) this.expandedTodoId = null;
          this.app.deleteTodo(projectId, todoId);
          this.render();
        }
      });
    });
  }

  // — Modal —

  _openModal(todo, projectId) {
    this._editingTodoId = todo ? todo.id : null;
    this._editingProjectId = projectId || this.app.activeProjectId;

    document.getElementById('modal-title').textContent = todo ? 'Edit Task' : 'New Task';

    document.getElementById('todo-title').value       = todo?.title       || '';
    document.getElementById('todo-description').value = todo?.description || '';
    document.getElementById('todo-due').value         = todo?.dueDate     || '';
    document.getElementById('todo-priority').value    = todo?.priority    || 'medium';
    document.getElementById('todo-notes').value       = todo?.notes       || '';

    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('todo-title').focus();
  }

  _closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    this._editingTodoId = null;
    this._editingProjectId = null;
  }

  _handleSaveTodo() {
    const title = document.getElementById('todo-title').value.trim();
    if (!title) {
      document.getElementById('todo-title').focus();
      document.getElementById('todo-title').classList.add('input-error');
      setTimeout(() => document.getElementById('todo-title').classList.remove('input-error'), 800);
      return;
    }

    const data = {
      title,
      description: document.getElementById('todo-description').value.trim(),
      dueDate:     document.getElementById('todo-due').value,
      priority:    document.getElementById('todo-priority').value,
      notes:       document.getElementById('todo-notes').value.trim(),
    };

    if (this._editingTodoId) {
      this.app.updateTodo(this._editingProjectId, this._editingTodoId, data);
    } else {
      this.app.addTodo(this._editingProjectId, data);
    }

    this._closeModal();
    this.render();
  }

  _handleAddProject() {
    const input = document.getElementById('new-project-input');
    const name  = input.value.trim();
    if (!name) return;

    const project = this.app.addProject(name);
    if (project) {
      this.app.setActiveProject(project.id);
      this.expandedTodoId = null;
      input.value = '';
      this.render();
    }
  }
}

// — Helpers (module-private) —

function _escape(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _formatDueDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    if (isToday(date))  return 'Today';
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

function _isOverdue(dateStr) {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
}

export default UIController;
