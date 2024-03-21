// PlayerScore.js
import React from 'react';

function PlayerScore({ player, score, updateScore }) {
  const handleUpdateScore = (points) => {
    updateScore(player, points);
  };

  return (
    <div className="player-score">
      <h3>Player {player}</h3>
      <p>Score: {score}</p>
      <button className="increment-button" onClick={() => handleUpdateScore(1)}>+1</button>
      <button className="decrement-button" onClick={() => handleUpdateScore(-1)}>-1</button>
      {/* Agregar más botones según sea necesario */}
    </div>
  );
}

export default PlayerScore;
