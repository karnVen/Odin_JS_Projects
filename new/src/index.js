import './styles/main.css';
import AppController from './modules/app.js';
import UIController from './ui/ui.js';

// Boot up once the DOM is ready.
// AppController handles data; UIController handles the screen — they don't know each other's internals.
document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  new UIController(app);
});
