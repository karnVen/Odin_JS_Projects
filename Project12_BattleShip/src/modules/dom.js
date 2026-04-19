export const DOM = {
  renderBoard(gameboard, containerId, isEnemy, attackCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous board

    for (let y = 0; y < gameboard.size; y++) {
      for (let x = 0; x < gameboard.size; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;

        // Render hits and misses
        if (gameboard.isMiss(x, y)) cell.classList.add('miss');
        if (gameboard.isHit(x, y)) cell.classList.add('hit');
        
        // Show ships only on the player's board (unless it's an enemy hit)
        if (!isEnemy && gameboard.hasShip(x, y)) {
          cell.classList.add('ship');
        }

        // Add event listeners only for the enemy board on un-clicked cells
        if (isEnemy && !gameboard.isMiss(x, y) && !gameboard.isHit(x, y)) {
          cell.addEventListener('click', () => attackCallback(x, y), { once: true });
        }

        container.appendChild(cell);
      }
    }
  },

  updateMessage(msg) {
    document.getElementById('message').textContent = msg;
  }
};