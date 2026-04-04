// A Todo represents a single task item.
// Keeping this as a plain class with no DOM concerns — all rendering is handled by the UI layer.

class Todo {
  constructor({ title, description = '', dueDate = '', priority = 'medium', notes = '', completed = false }) {
    // Generate a reasonably unique id without needing a library
    this.id = `todo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;       // stored as 'YYYY-MM-DD' string
    this.priority = priority;     // 'low' | 'medium' | 'high'
    this.notes = notes;
    this.completed = completed;
    this.createdAt = new Date().toISOString();
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  // update accepts a partial object and merges into this instance
  update({ title, description, dueDate, priority, notes }) {
    if (title !== undefined)       this.title = title;
    if (description !== undefined) this.description = description;
    if (dueDate !== undefined)     this.dueDate = dueDate;
    if (priority !== undefined)    this.priority = priority;
    if (notes !== undefined)       this.notes = notes;
  }
}

export default Todo;
