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
		const lastRowRegex = /\d+\.\s?(?:(?:\d|\w)+\s?){1,2}(?:#|\+)?\s(?:1\-0|0\-1|1\/2\-1\/2|\*)$/;
		if (props.pgn) {
			var lastRow = props.pgn.match(lastRowRegex)[0];
			console.log(lastRow)
			var fullMove = parseInt(lastRow.split('.')[0]);
			var halfMove = fullMove * 2;
			halfMove += lastRow.split(/\s|\./).length - 2; // accounting for turn number and game terminator
		}

		this.state = {
			halfMove: halfMove ? halfMove : 0
		};

		console.log(this.state)
		// console.log('Chess', Chess, typeof Chess);
		// New Plan: no chess logic at all in chessdiagram. Gets too messy.
		// // Having a problem where Jest is importing chess as an object, not function
		// if (typeof Chess === 'object') {
		// 	// console.log(Chess, Chess.Chess)
		// 	this.Chess = Chess.Chess;
		// } else {
		// 	this.Chess = Chess;
		// }
		// this.game = new this.Chess(props.startPosition);
		// if (props.pgn) {
		// 	this.game.load_pgn(props.pgn);
		// }
	}

	// Lifecycle events ////

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	// componentWillReceiveProps (nextProps) {
	// 	if (this.props.pgn !== nextProps.pgn) {
	// 		const oldPosition = this.game.pgn();
	// 		const result = this.game.load_pgn(nextProps.pgn);
	// 		if (!result) {
	// 			// Couldn't load fen string, reload previous position
	// 			console.error("Couldn't load new PGN")
	// 			this.game = this.game.load_pgn(oldPosition);
	// 		}
	// 	}
	// }

	// event handling ////

	_onMovePiece(pieceType, from, to) {
		if (this.props.allowMoves) {
			this.props.onMovePiece(pieceType, from, to);
		}
	}

	_moveHead(evt) {
		const limit = Number(evt.target.value);
		const direction = limit > 0 ? 1 : -1;
		for (let i = 0; i !== limit; i += direction) {
			const result = this.props.onMovePgnHead(direction);
			if (!result) {break;} else {}
		}
		this.forceUpdate();
	}

	// render function

	render() {
		return (
			<div>
				<BoardContainer
					style={{display: 'inline-block'}}
					{...this.props}
					// fen={this.game.fen()}
					onMovePiece={this._onMovePiece.bind(this)}
				/>
				{this.props.gameHistory ?
					<GameHistory
						style={{display: 'inline-block'}}
						newlineChar={this.props.newlineChar}
						moveHead={this._moveHead.bind(this)}
						pgn={this.props.pgn}
					/> : null}
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

Chessdiagram.defaultProps = {
	allowMoves: true,
	darkSquareColor:  "#005EBB",
	height: 'auto',
	files: 8,
	flip: false,
	gameHistory: false,
	lightSquareColor: "#2492FF",
	newlineChar: '\r?\n',
	pieceDefinitions: {},
	ranks: 8,
	squareSize: 45,
	width: 'auto',
};

export default Chessdiagram;
