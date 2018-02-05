import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
      <Square
       value={this.props.squares[i]}
       onClick={() => this.props.hanldeClick(i)}
       />);
    }
  
    render() {

        let ranges = [...Array(3).keys()];
        const board = ranges.map((row) => {
            return (
                <div className="board-row">
                    {
                        ranges.map((col) => {
                            return this.renderSquare(row * 3 + col);
                        })
                    }
                </div>
            );
        })

        return (
            <div>
                {board}
            </div>
        );
    }
  }
  
  class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state=  {
            history: [{
                squares: Array(9).fill(null),
                index: NaN
            }],
            xIsNext: true
        };
    }

    hanldeClick(index) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[index]) {
            return;
        }
        const value = this.state.xIsNext? "X": "O";
        squares[index] = value;
        this.setState({
            history: history.concat([{squares: squares, index}]),
            xIsNext: !this.state.xIsNext
        });
    }

    justTo(move) {
        const history = this.state.history.slice(0, move + 1);
        const xIsNext = (history.length % 2) === 1;
        this.setState({history, xIsNext});
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const index = step.index;
            const row = Math.floor(index / 3);
            const col = index % 3;
            const position = !isNaN(index)? `(${row}, ${col})` : "";
            let desc = `${move? "Go to move #" + move : "Go to game start"} ${position}`;
            return (
                <li key={move}>
                    <button onClick={() => this.justTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner is " + winner;
        }
        else {
            status = "Next is " + (this.state.xIsNext? "X" : "O");
        }

        
        return (
            <div className="game">
            <div className="game-board">
                <Board squares={current.squares} hanldeClick={(i) => this.hanldeClick(i)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
  }

  function calculateWinner(squares) {
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
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  