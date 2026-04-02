export class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }
    addTodo(todo) { this.todos.push(todo); }
    removeTodo(id) { this.todos = this.todos.filter(t => t.id !== id); }
}