// A Project is just a named container for todos.
// All the mutation methods live here to keep the app controller clean.

class Project {
  constructor(name) {
    this.id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter((t) => t.id !== todoId);
  }

  getTodo(todoId) {
    return this.todos.find((t) => t.id === todoId) || null;
  }

  // Returns todos sorted by creation date (newest first) so fresh items show at the top
  getSortedTodos() {
    return [...this.todos].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
}

export default Project;
