import { Gameboard } from '../src/modules/gameboard.js';
import { Ship } from '../src/modules/ship.js';

describe('Gameboard Factory', () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  test('places a ship at specific coordinates', () => {
    const submarine = new Ship(3);
    board.placeShip(submarine, 0, 0, false);
    expect(board.ships[0].coordinates).toEqual([
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }
    ]);
  });

  test('receiveAttack hits a ship', () => {
    const patrolBoat = new Ship(2);
    board.placeShip(patrolBoat, 5, 5, true);
    board.receiveAttack(5, 5);
    expect(patrolBoat.hits).toBe(1);
  });

  test('receiveAttack records missed shots', () => {
    board.receiveAttack(9, 9);
    expect(board.missedAttacks).toContainEqual({ x: 9, y: 9 });
  });

  test('reports when all ships are sunk', () => {
    const tinyShip = new Ship(1);
    board.placeShip(tinyShip, 2, 2, false);
    board.receiveAttack(2, 2);
    expect(board.allSunk()).toBe(true);
  });
});