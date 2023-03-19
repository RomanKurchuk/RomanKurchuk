import './App.css';
import React, {Component} from 'react';
import {COL_SIZE, ROW_SIZE} from './components/shape';
import * as s from './components/shape';
import Square from './components/square';
import Mutex from "await-mutex";

let name = prompt ("Enter your name")

const style = {
	width: "250px",
	height: "250px",
	margin: "0 auto",
	display: "grid",
	borderWidth: "10px",
	gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

const LEFT = 37;
const ROTATE_UP = 90;
const RIGHT = 39;
const DOWN = 40;
const ROTATE_DOWN = 88;
const STOP = 32;

const increaseSpeed = ({speed}) => speed - 10 * (speed > 10)

class App extends Component {
	constructor(props) {
		super(props);
		this.state = s.InitialState();
		this.mutex = new Mutex();
	}
	
	resetGame = () => this.setState(s.InitialState())
	
	componentDidMount() {
		this.periodicInterval = setInterval( () =>{
			this.mutex.lock();
			if (!this.state.isPause) {
				this.updateBoard({shapePos: s.DEFAULT_VALUE});
				this.shiftDown();
				this.updateBoard(this.state);
				this.setState({score: this.state.score+1})
			}
		}, this.state.speed);
		document.onkeydown = this.keyInput;
	}
	
	componentWillUnmount() {
		clearInterval(this.periodicInterval);
	}
	
	shiftRight = (isRight) => {
		let curShape = s.getShape(this.state);
		let {deltaX, func, isEdge} = isRight?
			{
				deltaX: 1,
				func: edgeVal => Math.max.apply(null, edgeVal),
				isEdge: this.state.xPos + curShape[0].length === ROW_SIZE,
			}: {
				deltaX: -1,
				func: edgeVal => Math.min.apply(null, edgeVal),
				isEdge: this.state.xPos === 0,
			};
			
	    if (isEdge) { return; }
	    let isConflict = false;
	
	    curShape.forEach(oldArray => {
		    let newArray = oldArray.filter(val => val !== s.DEFAULT_VALUE);
		    let edgeValue = func(newArray) + deltaX;
		    if (this.state.board[edgeValue] !== s.DEFAULT_VALUE) { isConflict = true; }
	    })
		
		if (!isConflict) {this.setState({xPos: this.state.xPos +deltaX});}
	}
	
	rotateClockwise = (isClockwise) => {
		let newState = {...this.state}
		newState.rotatePos = s.rotateShape(isClockwise, this.state);
		let newShape = s.getShape(newState);
		
		let isConflict = false;
		newShape.forEach(newArray => {
			let conflictedArray = newArray.filter (elem =>
			  (elem !== s.DEFAULT_VALUE) &&
			  (this.state.board[elem] !== s.DEFAULT_VALUE))
			console.log(newArray, conflictedArray, isConflict, (newState.xPos + newShape.length > ROW_SIZE));
			
			if((conflictedArray.length !== 0) || (newState.xPos + newShape.length >= ROW_SIZE)) {isConflict = true}
		})
		if (!isConflict) {this.setState({rotatePos: newState.rotatePos});}
	}
	getNextBlock = () => {
		let curShape = s.getShape(this.state);
		this.updateBoard(this.state);
		
		for(let i=0; i< curShape.length; i++) {
			let row = [...Array(ROW_SIZE)].map( (_, pos) => pos + ROW_SIZE * (this.state.yPos + i))
			let isFilled = row.map(pos => this.state.board[pos]).filter(val => val !== s.DEFAULT_VALUE).length === ROW_SIZE;
			if (isFilled) {
				let board = [...this.state.board];
				row.forEach(pos => board[pos] = s.DEFAULT_VALUE)
				for(let j=row[0]; j>0; j--) {
					if(board[j] !== s.DEFAULT_VALUE) {
						board[j+ROW_SIZE] = board[j];
						board[j] = s.DEFAULT_VALUE;
					}
				}
				this.setState({board: board});
			}
		}
		this.setState({
			shapePos: s.getRandomShape(),
			speed: increaseSpeed(this.state),
			yPos: -3,
			xPos: ROW_SIZE/2,
			rotatePos: 0,
		});
	}
	shiftDown = () => {
		let curShape = s.getShape(this.state);
		if(this.state.yPos + curShape.length >= COL_SIZE) {
			this.getNextBlock();
		    return 
		}
		curShape[0].forEach((_, pos) => {
			let newArray = curShape.map(row => (row[pos] === s.DEFAULT_VALUE)? -1: row[pos] + ROW_SIZE)
			let bottomValue = Math.max.apply(Math, newArray)
			if ( (this.state.board[bottomValue] !== undefined) && this.state.board[bottomValue] !== s.DEFAULT_VALUE) {
				if (this.state.yPos <= 0 && this.state.yPos !== -3) {
					this.getNextBlock();
					alert('Game Over');
					this.resetGame();
				} else {
					this.getNextBlock();
				}
				return;
			}
		})
		
		this.setState({yPos: this.state.yPos+1});
	}
	updateBoard = ({shapePos}) => {
		let board = [...this.state.board];
		let curShape = s.getShape(this.state);
		curShape.forEach( row => row.forEach( pos => {
			if(pos !== s.DEFAULT_VALUE) { board[pos] = shapePos; }
		}));
		this.setState({board: board});
	}
	pauseGame = () => this.setState({isPause: !this.state.isPause});
	keyInput = ({keyCode}) => {
		this.mutex.lock();
		if(this.state.isPause) {
			if(keyCode === STOP) {
				this.pauseGame();
			}
			return;
		}
		this.updateBoard({shapePos: s.DEFAULT_VALUE});
		switch (keyCode) {
			case LEFT:
			case RIGHT:
			  this.shiftRight(keyCode === RIGHT);
			  break;
			case ROTATE_UP:
			case ROTATE_DOWN:
			  this.rotateClockwise(keyCode === ROTATE_UP);
			  break;
			case DOWN:
			  this.shiftDown();
			  break;
			case STOP:
			  this.pauseGame();
			  break;
		}
		this.updateBoard(this.state);
	}
	render() {
		const board = this.state.board.map( (val, pos) => <Square key={pos} name={pos} color={val}/>);
		return (
		  <div className = "App">
			<h1> Time: {this.state.score}</h1>
			<h2> Just do it {name}</h2>
			<p> Right - figure to the right|Left - figure to the left|Down - lower the figure|Z - rotate the figure to the right|X - rotate the figure to the left|Space - pause game </p>
			<div style={style}> {board} </div>
		  </div>
		  );
	}
}

export default App;
