import ReactDOM from 'react-dom';
import './index.css';
import Game from "./components/game";

window.nbrColumns = 100;
window.nbrRows = 100;

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);