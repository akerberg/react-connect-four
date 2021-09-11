import React from 'react';
import './board.css';

function Square(props) {
    return (
        <td className="board-column">
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        </td>
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
            <tr
                className="board-row"
                key={key}>
                {columns}
            </tr>
        );
    }

    renderBoard(nbrColumns, nbrRows) {
        let rows = [];
        for (let i = 0; i < nbrRows; i++) {
            rows.push(this.renderRow(nbrColumns, i*nbrColumns));
        }
        return (
            <div className="wrapper">
                <table className="board">
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return this.renderBoard(window.nbrColumns,window.nbrRows);
    }
}

export default Board