import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

window.nbrColumns = 20;
window.nbrRows = 20;

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square
            key={i}
            value={this.props.squares.get(i)}
            onClick={() => this.props.onClick(i)}
        />);
    }

    renderRow(nbrColumns, startId) {
        let columns = [];
        for (let i = startId; i < startId + nbrColumns; i++) {
            columns.push(this.renderSquare(i));
        }
        let key = "startId" + startId;
        return (
            <div
                className="board-row"
                key={key}>
                {columns}
            </div>
        );
    }

    renderBoard(nbrColumns, nbrRows) {
        let rows = [];
        for (let i = 0; i < nbrRows; i++) {
            rows.push(this.renderRow(nbrColumns, i*nbrColumns));
        }
        return (
            <div>
                {rows}
            </div>
        );
    }

    render() {
        return this.renderBoard(window.nbrColumns,window.nbrRows);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: new Map(),
                lastPos: -1,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let squares = new Map(current.squares);
        if (squares.get(i) || calculateWinner(squares, window.nbrColumns, current.lastPos)) {
            return;
        }
        squares.set(i, this.state.xIsNext ? 'X' : 'O');
        this.setState({
            history: history.concat([{
                squares: squares,
                lastPos: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares, window.nbrColumns, current.lastPos);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i) }
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function isOnSameRow(first, second, columns) {
    return Math.floor(first/columns) === Math.floor(second/columns);
}

function isSameChar(first, second) {
    return first && first === second;
}

function isInARow(lastPos, squares, values) {
    let inARow = 1;
    let newChar = squares.get(lastPos);

    for (const pos of values) {
        let match = squares.get(pos);
        if (inARow === 4) {
            break;
        }
        else if (pos !== lastPos && isSameChar(match, newChar)) {
            inARow++;
        }
        else {
            inARow = 1;
        }
    }

    if (inARow === 4) {
        return newChar;
    }
    return null;
}

function horizontalValues(lastPos, columns) {
    let values = [];
    let potentialValues = [lastPos-3, lastPos-2, lastPos-1, lastPos+1, lastPos+2, lastPos+3];
    for (const pos of potentialValues) {
        if (isOnSameRow(lastPos, pos, columns)) {
            values.push(pos);
        }
    }
    return values;
}

function diagonalValueWithValidRow(lastPos, potentialValues, columns) {
    let values = [];
    let rowValues = [lastPos-columns*3, lastPos-columns*2, lastPos-columns*1,
        lastPos+columns*1, lastPos+columns*2, lastPos+columns*3];
    for (let i=0; i<potentialValues.length; i++) {
        if (isOnSameRow(rowValues[i], potentialValues[i], columns)) {
            values.push(potentialValues[i]);
        }
    }
    return values;
}

function diagonalValuesIncreasing(lastPos, columns) {
    let potentialValues = [lastPos-columns*3-3, lastPos-columns*2-2, lastPos-columns*1-1,
        lastPos+columns*1+1, lastPos+columns*2+2, lastPos+columns*3+3];
    return diagonalValueWithValidRow(lastPos, potentialValues, columns);
}

function diagonalValuesDecreasing(lastPos, columns) {
    let potentialValues = [lastPos-columns*3+3, lastPos-columns*2+2, lastPos-columns*1+1,
        lastPos+columns*1-1, lastPos+columns*2-2, lastPos+columns*3-3];
    return diagonalValueWithValidRow(lastPos, potentialValues, columns);
}

function calculateWinner(squares, columns, lastPos) {
    //Horizontal
    let values = horizontalValues(lastPos, columns);
    let winner = isInARow(lastPos, squares, values);
    if (winner) {
        return winner;
    }

    //Vertical
    values = [lastPos-columns*3, lastPos-columns*2, lastPos-columns*1,
        lastPos+columns*1, lastPos+columns*2, lastPos+columns*3];
    winner = isInARow(lastPos, squares, values);
    if (winner) {
        return winner;
    }

    //Diagonal increasing
    values = diagonalValuesIncreasing(lastPos, columns);
    winner = isInARow(lastPos, squares, values);
    if (winner) {
        return winner;
    }

    //Diagonal decreasing
    values = diagonalValuesDecreasing(lastPos, columns);
    winner = isInARow(lastPos, squares, values);
    if (winner) {
        return winner;
    }

    //Diagonal
    return null
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);