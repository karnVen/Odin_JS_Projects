export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.missedAttacks = [];
    this.successfulAttacks = [];
  }

  placeShip(ship, startX, startY, isVertical = false) {
    const coordinates = [];
    for (let i = 0; i < ship.length; i++) {
      if (isVertical) coordinates.push({ x: startX, y: startY + i });
      else coordinates.push({ x: startX + i, y: startY });
    }
    this.ships.push({ ship, coordinates });
  }

  receiveAttack(x, y) {
    // Check if the coordinates hit a ship
    for (const entry of this.ships) {
      const hitFound = entry.coordinates.find(coord => coord.x === x && coord.y === y);
      if (hitFound) {
        entry.ship.hit();
        this.successfulAttacks.push({ x, y });
        return true;
      }
    }
    
    // If no ship was hit, it's a miss
    this.missedAttacks.push({ x, y });
    return false;
  }

  isMiss(x, y) {
    return this.missedAttacks.some(coord => coord.x === x && coord.y === y);
  }

  isHit(x, y) {
    return this.successfulAttacks.some(coord => coord.x === x && coord.y === y);
  }

  hasShip(x, y) {
    return this.ships.some(entry => 
      entry.coordinates.some(coord => coord.x === x && coord.y === y)
    );
  }

  allSunk() {
    if (this.ships.length === 0) return false;
    return this.ships.every(entry => entry.ship.isSunk());
  }
}