import Board from "./Board";
import React from "react";
import Item from "./Item";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        "copper",
        "iron",
        "gold",
        "diamond",
        "emerald",
        "amethyst",
        "sugar",
        "wheat",
        "bread",
        "cookie",
        "glowberrie",
        "apple",
        "appleX",
        "carrot",
        "carrotX",
        "egg",
        "beetroot",
        "potato",
        "honey",
        "potion",
        "exp",
        "discX",
        "compass",
        "compassX",
        "disc",
        "book",
        "slime",
        "pearl",
        "eggX",
        "glowink",
        "honeycomb",
        "glowstone",
        "bone",
        "pickaxe",
        "spyglass",
      ],
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      difficulty: 2,
      isPlayerNext: true,
      player: "amethyst",
      computer: "diamond",
      difficulties: [0, 0.45, 0.65, 0.85],
      difficultiesNames: ["Peaceful", "Easy", "Normal", "Hard"],
    };
  }

  jumpTo(step) {
    if (step === 0) {
      this.setState({
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        stepNumber: 0,
        isPlayerNext: true,
      });
      return;
    }

    this.setState({
      stepNumber: step,
      isPlayerNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const gameHistory = this.state.history.slice(0, this.state.stepNumber + 1);
    const difficulty = this.state.difficulties[this.state.difficulty];
    const current = gameHistory[gameHistory.length - 1];
    const squares = current.squares.slice();

    const players = {
      One: this.state.player,
      Two: this.state.computer,
    };

    if (squares[i] || getWinner(squares)) {
      return;
    }

    squares[i] = players.One;

    const computerMove = getComputerMove(squares, players, difficulty);

    if (!(squares[computerMove] || getWinner(squares))) {
      squares[computerMove] = players.Two;
    }

    this.setState({
      history: gameHistory.concat([{ squares: squares }]),
      stepNumber: gameHistory.length,
      isPlayerNext: true,
    });
  }

  handleDifficulty() {
    const difficulties = this.state.difficulties;
    let difficulty = this.state.difficulty;

    difficulty += 1;
    if (difficulty === difficulties.length) {
      difficulty = 0;
    }

    this.setState({
      difficulty: difficulty,
    });
  }

  handleOptions(currentPlayer, option) {
    const player = this.state.player;
    const computer = this.state.computer;
    const oldHistory = this.state.history;
    const newHistory = [];

    for (let i = 0; i < oldHistory.length; i++) {
      const squares = oldHistory[i].squares.slice();

      for (let j = 0; j < squares.length; j++) {
        if (squares[j] === currentPlayer) {
          squares[j] = option;
        }
      }

      newHistory.push({ squares: squares });
    }

    this.setState({
      player: player === currentPlayer ? option : player,
      computer: computer === currentPlayer ? option : computer,
      history: newHistory,
    });
  }

  render() {
    const computer = this.state.computer;
    const history = this.state.history;
    const options = this.state.options;
    const player = this.state.player;

    const current = history[this.state.stepNumber];
    const winner = getWinner(current.squares);

    const difficulty =
      "Difficulty: " + this.state.difficultiesNames[this.state.difficulty];

    const playerOptions = options
      .filter((item) => item !== computer && item !== player)
      .map((option, step) => {
        return (
          <ul key={step}>
            <button
              className="square"
              onClick={() => this.handleOptions(player, option)}
            >
              <Item itemName={option} />
            </button>
          </ul>
        );
      });

    const computerOptions = options
      .filter((item) => item !== player && item !== computer)
      .map((option, step) => {
        return (
          <ul key={step}>
            <button
              className="square"
              onClick={() => this.handleOptions(computer, option)}
            >
              <Item itemName={option} />
            </button>
          </ul>
        );
      });

    const moves = history.map((step, move) => {
      const desc = move ? "Go back to turn " + move : "New Game!";
      return (
        <ul key={move}>
          <button
            className="minecraft-button"
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </ul>
      );
    });

    let status;

    if (winner) {
      status = winner + " won!";
    } else if (current.squares.every((item) => item !== null)) {
      status = "It's a draw!";
    } else {
      status = this.state.isPlayerNext
        ? player + "'s turn"
        : computer + "'s turn";
    }

    return (
      <div className="game">
        <div className="game-board" id="side">
          <div className="status">Player's Inventory</div>
          <div className="game-info">{playerOptions}</div>
        </div>
        <div className="game-board" id="main">
          <div className="status">{status}</div>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <div className="game-info">
            <ol>
              <button
                className="minecraft-button"
                onClick={() => this.handleDifficulty()}
              >
                {difficulty}
              </button>
              {moves}
            </ol>
          </div>
        </div>
        <div className="game-board" id="side">
          <div className="status">Computer's Inventory</div>
          <div className="game-info">{computerOptions}</div>
        </div>
      </div>
    );
  }
}

function getEmptySquares(gameState) {
  return gameState
    .map((square, step) => {
      if (square === null) {
        return step;
      }
      return undefined;
    })
    .filter((square) => square !== undefined);
}

function getComputerMove(gameState, players, difficult) {
  const move = minimax(gameState, players, false, -Infinity, Infinity).move;
  const possibleMoves = getEmptySquares(gameState);

  return Math.random() < difficult
    ? move
    : possibleMoves[(Math.random() * possibleMoves.length) | 0];
}

function minimax(gameState, players, isOneNext, alpha, beta) {
  const possibleMoves = getEmptySquares(gameState);
  const winner = getWinner(gameState);
  const One = players.One;
  const Two = players.Two;

  if (One === winner) {
    return { score: 1 };
  }

  if (Two === winner) {
    return { score: -1 };
  }

  if (winner === null && possibleMoves.length === 0) {
    return { score: 0 };
  }

  let bestMove;
  let bestScore;

  if (isOneNext) {
    bestScore = -Infinity;

    for (let i = 0; i < possibleMoves.length; i++) {
      const move = possibleMoves[i];
      gameState[move] = isOneNext ? One : Two;

      let score = minimax(
        gameState.slice(),
        players,
        !isOneNext,
        alpha,
        beta
      ).score;

      gameState[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      alpha = Math.max(alpha, bestScore);

      if (alpha >= beta) {
        break;
      }
    }
  } else {
    bestScore = Infinity;

    for (let i = 0; i < possibleMoves.length; i++) {
      const move = possibleMoves[i];
      gameState[move] = isOneNext ? One : Two;

      let score = minimax(
        gameState.slice(),
        players,
        !isOneNext,
        alpha,
        beta
      ).score;

      gameState[move] = null;

      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }

      beta = Math.min(beta, bestScore);

      if (beta <= alpha) {
        break;
      }
    }
  }

  return { move: bestMove, score: bestScore };
}

function getWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export default Game;
