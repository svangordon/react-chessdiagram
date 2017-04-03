/*

MIT License

Copyright (c) 2016 Judd Niemann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

// chessdiagram.js : defines Chess Diagram Component

import React, { Component } from 'react';
import Board from './board.js';
import BoardContainer from './BoardContainer.js';
import GameHistory from './GameHistory.js';
import Piece from './piece.js';
import standardPieceDefinitions from './pieceDefinitions.js';
import Chess from 'chess.js';

/** Chessdiagram : draws a chess diagram consisting of a board and pieces, using svg graphics */
class Chessdiagram extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPosition: props.fen
		};
	}

	// Lifecycle events ////


	// event handling ////

	_onMovePiece(pieceType, from, to) {
		if (this.props.allowMoves) {
			this.props.onMovePiece(pieceType, from, to);
		}
	}

	_onMovePgnHead(direction, instructions) {
		console.log(direction, instructions);
		let result;
		if (direction === -1) {
			const instruction = instructions[0];
			result = [];
			let currentFrame = instruction;
			for (let i = instruction.move; i < 0; i++) {
				currentFrame = Object.assign(
					{},
					currentFrame.options
					this.props.reversePgn(currentFrame)
				);
				result.push(currentFrame);
			}
		} else {

		}
	}

	_onAdvancePgn(startPgn, moves) {
		const movePgnResult = this.props.advancePgn(startPgn, moves);
		console.log('movePgnResult', movePgnResult);
	}

	_onReversePgn(startPgn, moves) {
		const movePgnResult = this.props.reversePgn(startPgn, moves);
		console.log('movePgnResult', movePgnResult);
	}

	// _getFenFromPgn()

	// render function

	render() {
		return (
			<div>
				<BoardContainer
					{...this.props}
					fen={this.state.currentPosition}
					style={{display: 'inline-block'}}
					onMovePiece={this._onMovePiece.bind(this)}
				/>
				{this.props.gameHistory ?
					<GameHistory
						advancePgn={this._onAdvancePgn.bind(this)}
						reversePgn={this._onReversePgn.bind(this)}
						style={{display: 'inline-block'}}
						newlineChar={this.props.newlineChar}
						moveHead={this._onMovePgnHead.bind(this)}
						pgn={this.props.pgn}
					/> : null
				}
			</div>
		);
	}
}

Chessdiagram.propTypes = {
	allowMoves: React.PropTypes.bool,
	darkSquareColor: React.PropTypes.string,
	files: React.PropTypes.number,
	/** if true, rotates the board so that Black pawns are moving up, and White pawns are moving down the board */
	flip: React.PropTypes.bool,
	/** whether to render a GameHistory component */
	gameHistory: React.PropTypes.bool,
	getNthMove: React.PropTypes.func,
	/** height of main svg container in pixels. If setting this manually, it should be at least 9 * squareSize to fit board AND labels*/
	height: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]),
	lightSquareColor: React.PropTypes.string,
	/** Pgn line separator. Defaults to '\r?\n'*/
	newlineChar: React.PropTypes.string,
	/** callback function which is called when user moves a piece. Passes pieceType, initialSquare, finalSquare as parameters to callback */
	onMovePiece: React.PropTypes.func,
	/** callback for when user changes which move in a pgn they are viewing. called
	* with the direction that we're moving */
	onMovePgnHead: React.PropTypes.func,
	/** callback function which is called when user clicks on a square. Passes name of square as parameter to callback */
	onSelectSquare: React.PropTypes.func,
	options: React.PropTypes.object,
	pgn: React.PropTypes.string,
	/** Height of pgn viewer component */
	pgnHeight: React.PropTypes.number,
	/** array of pieces at particular squares (alternative to fen) eg ['P@f2','P@g2','P@h2','K@g1'].
	* This format may be more suitable for unconventional board dimensions, for which standard FEN would not work.
	* Note: If both FEN and pieces props are present, FEN will take precedence */
	pieces: React.PropTypes.array,
	/** Optional associative array containing non-standard chess characters*/
	pieceDefinitions: React.PropTypes.object,
	ranks: React.PropTypes.number,
	squareSize: React.PropTypes.number,
	/** Chess position in FEN format (Forsyth-Edwards Notation). eg "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" */
	startPosition: React.PropTypes.string,
	/** width of main svg container in pixels. If setting this manually, it should be at least 9 * squareSize to fit board AND labels*/
	width: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]),
};

// Half-move
const getNthMoveDefault = (pgn, move) => {
	var Game = require('chess.js');
	if (game.Chess) { // HACK: make it work in the test suite
		Game = Game.Chess;
	}
	var game = new Game();
	game.load_pgn(pgn);
	for (let i = game.history().length - move; i > 0; i--) {
		game.undo();
	}
	return game.fen();
}

const advancePgnDefault = (startPgn, move) => {
	var Game = require('chess.js');
	if (game.Chess) { // HACK: make it work in the test suite
		Game = Game.Chess;
	}
	var game = new Game();
	game.load_pgn(startPgn);
	return game.move(move);
}

const reversePgnDefault = (startPgn) => {
	var Game = require('chess.js');
	if (Game.Chess) { // HACK: make it work in the test suite
		Game = Game.Chess;
	}
	var game = new Game();
	game.load_pgn(startPgn);
	const result = game.undo()
	return {pgn: game.pgn(), move: game.move()};
}

Chessdiagram.defaultProps = {
	advancePgnDefault: advancePgnDefault,
	allowMoves: true,
	darkSquareColor:  "#005EBB",
	height: 'auto',
	files: 8,
	flip: false,
	gameHistory: false,
	getNthMove: getNthMoveDefault,
	lightSquareColor: "#2492FF",
	newlineChar: '\r?\n',
	pieceDefinitions: {},
	pgnHeight: 400,
	ranks: 8,
	reversePgn: reversePgnDefault,
	squareSize: 45,
	width: 'auto',
};


export default Chessdiagram;
