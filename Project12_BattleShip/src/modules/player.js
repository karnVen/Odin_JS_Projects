import { Gameboard } from './gameboard.js';

export class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
    this.previousMoves = new Set();
  }

  randomAttack() {
    let x, y, moveStr;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      moveStr = `${x},${y}`;
    } while (this.previousMoves.has(moveStr));

    this.previousMoves.add(moveStr);
    return { x, y };
  }
}