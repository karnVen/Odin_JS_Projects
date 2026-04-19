import './style.css';
import { Player } from './modules/player.js';
import { Ship } from './modules/ship.js';
import { DOM } from './modules/dom.js';

let player;
let computer;
let gameOver = false;

function initGame() {
  player = new Player('Admiral');
  computer = new Player('AI', true);
  gameOver = false;

  // Hardcode Player Ships
  player.gameboard.placeShip(new Ship(4), 0, 0, false); // Battleship
  player.gameboard.placeShip(new Ship(3), 5, 5, true);  // Cruiser
  player.gameboard.placeShip(new Ship(2), 8, 8, false); // Patrol

  // Hardcode Computer Ships
  computer.gameboard.placeShip(new Ship(4), 1, 1, false);
  computer.gameboard.placeShip(new Ship(3), 8, 2, true);
  computer.gameboard.placeShip(new Ship(2), 4, 7, false);

  DOM.updateMessage("Attack the enemy waters!");
  renderAll();
}

function handleAttack(x, y) {
  if (gameOver) return;

  // 1. Player attacks Computer
  computer.gameboard.receiveAttack(x, y);
  
  if (computer.gameboard.allSunk()) {
    gameOver = true;
    DOM.updateMessage("Victory! You sank all enemy ships.");
    renderAll();
    return;
  }

  // 2. Computer attacks Player
  const compMove = computer.randomAttack();
  player.gameboard.receiveAttack(compMove.x, compMove.y);

  if (player.gameboard.allSunk()) {
    gameOver = true;
    DOM.updateMessage("Defeat! The enemy sank all your ships.");
    renderAll();
    return;
  }

  renderAll();
}

function renderAll() {
  DOM.renderBoard(player.gameboard, 'player-board', false, null);
  DOM.renderBoard(computer.gameboard, 'computer-board', true, handleAttack);
}

// Start the game
initGame();