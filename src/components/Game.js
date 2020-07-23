import React, { Component } from 'react'
import Board from './Board';

export default class Game extends Component {

    constructor(props)  {
        super(props);
        this.state =  {
            xIsNext : true,
            stepNumber : 0,
            difficulty : 'Easy',
            history:[
                { squares:Array(9).fill(null) }
            ]
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            difficulty: event.target.value,
            stepNumber : 0,
            history:[
                { squares:Array(9).fill(null) }
            ]
        });
    }

    handleClick(i)  {
        let steps = this.state.stepNumber;
        let history = this.state.history.slice(0,steps+1);
        let current = history[history.length - 1];
        let squares = current.squares.slice();
        let winner = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        
        squares[i] = 'X';
        winner = calculateWinner(squares);
        if (winner)
        {
            this.setState({
                history: history.concat({
                    squares: squares
                }),
                xIsNext: !this.state.xIsNext,
                stepNumber: history.length
            })
            return;
        }
        let j = getPlace(squares,1,this.state.difficulty);
        /*if(steps === 0)
            console.clear();*/
        squares[j] = 'O';
        this.setState({
            history: history.concat({
                squares: squares
            }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }

    jumpTo(step) {
        this.setState ({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? "Go to #" + move : "Start new game";
            return (
                <li key = {move}>
                    <button onClick={() => {this.jumpTo(move)}} >
                        {desc}
                    </button>
                </li>
            )
        });

        let status;
        const step = this.state.stepNumber;

        if(winner) {
            status = 'Winner is ' + winner;
        }
        else if (step < 5) {
            status = 'Next Player is X';
        }
        else {
            status = 'Game Drawn';
        }

        return (
            <div className = "game">
                <div className = "difficulty">
                    <label>
                        Choose the difficulty:
                        {' '}
                        <select value={this.state.difficulty} onChange={this.handleChange}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </label>
                </div>
                <div className = "game-board">
                    <Board onClick={(i) => { this.handleClick(i);}}
                            squares={current.squares}
                    />
                </div>

                <div className = "game-info">
                    <div>{status}</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        )
    }
}



function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [2,4,6]
    ];
    for(let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return squares[a];
    }
    return null;
}


function getPlace(squares, turn, difficulty) {

    if (turn === 1) {
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,4,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [2,4,6]
        ];
        for(let i = 0; i < lines.length; i++) {
            const [a,b,c] = lines[i];
            if(squares[a] && squares[a] === squares[b] && !squares[c] && squares[a] === 'O')
                return c;
            if(squares[a] && squares[a] === squares[c] && !squares[b] && squares[c] === 'O')
                return b;
            if(squares[b] && squares[b] === squares[c] && !squares[a] && squares[b] === 'O')
                return a;
        }

        for(let i = 0; i < lines.length; i++) {
            const [a,b,c] = lines[i];
            if(squares[a] && squares[a] === squares[b] && !squares[c] && squares[a] === 'X')
                return c;
            if(squares[a] && squares[a] === squares[c] && !squares[b] && squares[c] === 'X')
                return b;
            if(squares[b] && squares[b] === squares[c] && !squares[a] && squares[b] === 'X')
                return a;
        }
    }

    if((turn === 2 && difficulty === 'Easy') || (turn === 4 && difficulty === 'Medium') || (turn === 6 && difficulty === 'Hard')) {
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                squares[i] = 'X';
                const winner = calculateWinner(squares);
                if (winner && winner === 'X') {
                    squares[i] = null;
                    return null;
                }
                squares[i] = null;
            }
        }
        return -1;
    }

    var win = [], draw = [];

    let done = 0;
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            done = 1;
            if (turn % 2 === 1) {
                squares[i] = 'O';
                const winner = calculateWinner(squares);
                if (winner && winner === 'O') {
                    win.push(i);
                }
                else {
                    let j = getPlace(squares, turn + 1, difficulty);
                    //console.log(i + ' ' + j);
                    if (j) {
                        if (j === -1) {
                            draw.push(i);
                        }
                        else {
                            win.push(i);
                        }
                    }
                }
            }
            else {
                squares[i] = 'X';
                const winner = calculateWinner(squares);
                if (winner && winner === 'X') {
                    squares[i] = null;
                    return null;
                }
                else {
                    let j = getPlace(squares, turn + 1, difficulty);
                    if (!j) {
                        squares[i] = null;
                        return null;
                    }
                    else if (j === -1) {
                        draw.push(i);
                    }
                }
            }
            squares[i] = null;
        }
    }

    if (done === 0) {
        return -1;
    }

    if (win.length === 0) {
        if (draw.length === 0)  {
            if (turn === 3 || turn === 5 || turn === 7) {
                return null;
            }

            var any_move = [];

            for (let i = 0; i < 9; i++) {
                if (!squares[i]) {
                    any_move.push(i);
                }
            }

            let len = any_move.length;
            let pos = Math.floor(Math.random() * len);
            return any_move[pos];
        }
        else {
            if(turn % 2 === 1) {
                let len = draw.length;
                let pos = Math.floor(Math.random() * len);
                return draw[pos];
            }
            else {
                return -1;
            }
        }
    }
    else {
        let len = win.length;
        let pos = Math.floor(Math.random() * len);
        return win[pos];
    }
}
