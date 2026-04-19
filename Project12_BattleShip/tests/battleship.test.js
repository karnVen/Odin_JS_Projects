import { Ship } from '../src/modules/ship.js';
import { Gameboard } from '../src/modules/gameboard.js';

describe('Ship Factory', () => {
  test('takes hits and reports sunk correctly', () => {
    const ship = new Ship(2);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe('Gameboard Factory', () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  test('places ships at specific coordinates', () => {
    const ship = new Ship(3);
    board.placeShip(ship, 0, 0, false);
    expect(board.hasShip(0, 0)).toBe(true);
    expect(board.hasShip(2, 0)).toBe(true);
    expect(board.hasShip(3, 0)).toBe(false);
  });

  test('records missed attacks', () => {
    board.receiveAttack(5, 5);
    expect(board.isMiss(5, 5)).toBe(true);
  });

  test('directs hits to the correct ship', () => {
    const ship = new Ship(2);
    board.placeShip(ship, 2, 2, true);
    board.receiveAttack(2, 2);
    board.receiveAttack(2, 3);
    expect(ship.isSunk()).toBe(true);
  });

  test('reports when all ships are sunk', () => {
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);
    board.placeShip(ship1, 0, 0, false);
    board.placeShip(ship2, 9, 9, false);
    
    board.receiveAttack(0, 0);
    expect(board.allSunk()).toBe(false);
    
    board.receiveAttack(9, 9);
    expect(board.allSunk()).toBe(true);
  });
});