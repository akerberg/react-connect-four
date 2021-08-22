import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Sidebar from "./components/sidebar";
import Board from "./components/board";
import {AiOutlineHistory} from "react-icons/ai";

window.nbrColumns = 20;
window.nbrRows = 20;

export const jumpState = {
    BACK: "back",
    FORWARD: "forward",
    START: "start",
}

export default class Game extends React.Component {
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
        this.jumpToState = this.jumpToState.bind(this);
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

    jumpToState(state) {
        if (state === jumpState.BACK) {
            this.jumpTo(this.state.stepNumber-1);
        }
        else if (state === jumpState.FORWARD) {
            this.jumpTo(this.state.stepNumber+1);
        }
        else {
            this.jumpTo(0);
        }
    }

    createHistoryData(history, stepNumber) {
        let historyData = [];
        if (history.length > 1 && stepNumber > 0) {
            historyData.push(
                {
                    title: 'Undo',
                    path: '/',
                    state: jumpState.BACK,
                    icon: <AiOutlineHistory />,
                    cName: 'nav-text'
                }
            )
        }
        if (history.length > 1 && stepNumber < history.length -1) {
            historyData.push(
                {
                    title: 'Redo',
                    path: '/',
                    state: jumpState.FORWARD,
                    icon: <AiOutlineHistory />,
                    cName: 'nav-text'
                }
            )
        }
        return historyData;
    }

    createStatusText(squares, lastPos) {
        const winner = calculateWinner(squares, window.nbrColumns, lastPos);
        if (winner) {
            return 'Winner: ' + winner;
        } else {
            return 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        let status = this.createStatusText(current.squares, current.lastPos);
        let historyData = this.createHistoryData(history, this.state.stepNumber);
        let squares = current.squares;

        return (
            <>
                <Router>
                    <Sidebar nextPlayer={status} historyData={historyData} jumpToState={this.jumpToState}/>
                     <Switch>
                         <Route exact path="/">
                             <Board squares={squares} onClick={(i) => this.handleClick(i) }/>
                         </Route>
                         <Route exact path="/about">
                             Simple connect 4 game created in react. Build upon react tutorial:
                             <a href='https://reactjs.org/tutorial/tutorial.html'>
                                 https://reactjs.org/tutorial/tutorial.html
                             </a>
                        </Route>
                    </Switch>
                </Router>
            </>
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