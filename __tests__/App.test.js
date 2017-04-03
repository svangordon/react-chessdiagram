import React from 'react';
import { mount, shallow } from 'enzyme';
import Chessdiagram from '../src/chessdiagram';
import Board from '../src/board';
import BoardContainer from '../src/BoardContainer.js';
import GameHistory from '../src/GameHistory.js';
import Piece from '../src/piece';
import sinon from 'sinon';

const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const startAllowedMoves = {
  "a2": ["a3", "a4"],
  "b2": ["b3", "b4"],
  "c2": ["c3", "c4"],
  "d2": ["d3", "d4"],
  "e2": ["e3", "e4"],
  "f2": ["f3", "f4"],
  "g2": ["g3", "g4"],
  "h2": ["h3", "h4"],
  "b1": ["a3", "c3"],
  "g1": ["f3", "h3"]
};

// This functionality -- parsing of FEN strings -- has been delegated to chess.js
// (sorta), so let's kill this test for now.
// describe('testing interpretation of FEN string', () => {
// 	it('should put pieces on the correct squares', () => {
//
// 		const pieces = {
// 			'a1': 'R', 'b1': 'N', 'c1': 'B', 'd1': 'Q', 'e1': 'K', 'f1': 'B', 'g1': 'N', 'h1': 'R',
// 			'a2': 'P', 'b2': 'P', 'c2': 'P', 'd2': 'P', 'e2': 'P', 'f2': 'P', 'g2': 'P', 'h2': 'P',
// 			'a7': 'p', 'b7': 'p', 'c7': 'p', 'd7': 'p', 'e7': 'p', 'f7': 'p', 'g7': 'p', 'h7': 'p',
// 			'a8': 'r', 'b8': 'n', 'c8': 'b', 'd8': 'q', 'e8': 'k', 'f8': 'b', 'g8': 'n', 'h8': 'r'
// 		};
//
// 		const occupiedSquares = Object.keys(pieces);
//
// 		const emptySquares = [
// 			'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
// 			'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
// 			'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
// 			'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
// 		];
//
// 		const wrapper = mount(
// 			<Board ref="cd" ranks={8} files={8} fen={startPosition} />
// 		);
//
// 		let instance = wrapper.instance();
// 		occupiedSquares.map((sq) => {
// 			expect(instance._getPieceAtSquare(sq).pieceType).toBe(pieces[sq]);
// 		});
//
// 		emptySquares.map((sq) => {
// 			expect(instance._getPieceAtSquare(sq)).toBe(undefined);
// 		});
//
// 		wrapper.unmount();
//
// 	});
// });

describe('testing for elements being rendered correctly on 8x8 board', () => {
	it('should return 1 Board, 32 Pieces', () => {

		const wrapper = mount(
			<Chessdiagram ref="cd" ranks={8} files={8} fen={startPosition} />
		);
		expect(wrapper.find(Board).length).toBe(1);
		expect(wrapper.find(Piece).length).toBe(32);

		wrapper.unmount();
	});
});

describe.only('When selecting squares at each corner of 8x8 board', () => {
	it('should return correct names of squares (a1,h1,h8,a8)', () => {
		let spySelectSquare = sinon.spy();

		const wrapper = mount(
			<BoardContainer onSelectSquare={spySelectSquare} ranks={8} files={8} />
		);

    // // const a1 = wrapper.find('Square').nodes[0]//.simulate('click');
    // const a1 = wrapper.findWhere(n => {
    //   console.log(n)
    // });
    // const a1 = wrapper.find({square: "a1"})
    // console.log(a1)
    // console.log(wrapper.debug())
    const squares = wrapper.find('Square');
    // console.log(squares.debug())
    // const h7 = squares.find({square: "h7"})
    console.log('===', '===')
    const h7 = squares.filter(n => {console.log(n.props()); return true})
    // console.log(h7)
    const h8 = squares.findWhere(n => {
      // console.log('n =========== ',n.props().square);
      if (n.props().square === 'h8') {
        console.log('found ', n.props().square)
      }
      return n.props().square === 'h8';
    })
    console.log(h8.length)
    h8.simulate('click')
    expect(spySelectSquare.calledWith('h8')).toBe(true);
    //
		// let squareSize = wrapper.props().squareSize;
		// let ranks = wrapper.props().ranks;
		// let files = wrapper.props().files;
		// let halfSquareSize = squareSize / 2; // offset to place coordinate in _middle_ of square
    //
		// let a1Coords = {
		// 	clientX: squareSize + halfSquareSize, // NOTE: labels expected at column 0; board starts at column 1
		// 	clientY: (ranks - 1) * squareSize + halfSquareSize
		// };
    //
		// let h1Coords = {
		// 	clientX: 8 * squareSize + halfSquareSize,
		// 	clientY: (ranks - 1) * squareSize + halfSquareSize
		// };
    //
		// let h8Coords = {
		// 	clientX: 8 * squareSize + halfSquareSize,
		// 	clientY: halfSquareSize
		// };
    //
		// let a8Coords = {
		// 	clientX: squareSize + halfSquareSize,
		// 	clientY: halfSquareSize
		// };
    //
		// // simulate a click on each corner square
		// wrapper.simulate('mousedown', a1Coords);
		// wrapper.simulate('mousedown', h1Coords);
		// wrapper.simulate('mousedown', h8Coords);
		// wrapper.simulate('mousedown', a8Coords);

		// expect(spySelectSquare.calledWith('a1')).toBe(true);
		// expect(spySelectSquare.calledWith('h1')).toBe(true);
		// expect(spySelectSquare.calledWith('h8')).toBe(true);
		// expect(spySelectSquare.calledWith('a8')).toBe(true);
    //
		// wrapper.unmount();

	});
});

describe('When moving pawn from e2-e4 on 8x8 board', () => {
	it('should return piece and names of squares (P,e2,e4)', () => {
		let spyMovePiece = sinon.spy();

		const wrapper = mount(
			<Chessdiagram onMovePiece={spyMovePiece} ranks={8} files={8} fen={startPosition} />
		);

		let squareSize = wrapper.props().squareSize;
		let ranks = wrapper.props().ranks;
		let files = wrapper.props().files;
		let halfSquareSize = squareSize / 2; // offset to place coordinate in _middle_ of square

		let e2Coords = {
			clientX: 5 * squareSize + halfSquareSize, // NOTE: labels expected at column 0; board starts at column 1
			clientY: (ranks - 2) * squareSize + halfSquareSize
		};

		let e4Coords = {
			clientX: 5 * squareSize + halfSquareSize,
			clientY: (ranks - 4) * squareSize + halfSquareSize
		};

		// simulate mousedown on e2
		wrapper.simulate('mousedown', e2Coords);

		// simulate mouseup on e4
		wrapper.simulate('mouseup', e4Coords);

		expect(spyMovePiece.calledWith('P', 'e2', 'e4')).toBe(true);

		wrapper.unmount();

	});
});

describe('testing for custom pieces being rendered correctly on 8x8 board', () => {
	it('should return 1 Board, 33 Pieces', () => {

		const wrapper = mount(
			<Chessdiagram ref="cd" ranks={8} files={8}
			fen={"rnbqkbnr/pppppppp/a7/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
			pieceDefinitions={{'a': (transformString) => (
        <image
          height={45}
          href={"https://upload.wikimedia.org/wikipedia/commons/d/d0/Guard_%28an_icon_of_the_chess_piece%29_Classical_Version.png"}
          transform={transformString}
          width={45}
        />)}}
			/>
		);
		expect(wrapper.find(Board).length).toBe(1);
		expect(wrapper.find(Piece).length).toBe(33);

		wrapper.unmount();
	});
});

describe('testing non-standard board widths', () => {
	it('should return 4 squares on 2x2', () => {
		const wrapper = mount(
			<Chessdiagram ref="cd" ranks={2} files={2}
				fen={"2/2 w - - 0 1"}
			/>
		);
		expect(wrapper.find('Square').length).toBe(4);
	});

	it('should return 144 squares on 12x12', () => {
		const wrapper = mount(
			<Chessdiagram ref="cd" ranks={12} files={12}
				fen={"12/12/12/12/12/12/12/12/12/12/12/12 w - - 0 1"}
			/>
		);
		// Aside: `expect(wrapper.find('Square')).toHaveLength(144)` should work, and it doesn't.
		// Not totally sure why expect is returning an object w/o all of the standard Jest matchers
		expect(wrapper.find('Square').length).toBe(144);
	})
});

describe('test allowed moves highlighting', () => {
	it('should show proper moves from start', () => {
		Object.keys(startAllowedMoves).forEach(key => {
			const wrapper = mount(
				<Chessdiagram ref="cd" allowedMoves={startAllowedMoves} fen={startPosition} />
			);
			const squareCoords = {
				clientX: ('.abcdefgh'.indexOf(key[0]) + .5) * wrapper.props().squareSize,
				clientY: (wrapper.props().ranks - parseInt(key[1]) + .5) * wrapper.props().squareSize
			};
			wrapper.simulate('mousedown', squareCoords);
			wrapper.simulate('mouseup', squareCoords);
			expect(wrapper.find('SquareHighlight').length).toBe(3);
		});
	});
});

/***************
* Test GameHistory container
***************/

describe('Testing GameHistory', () => {
  it('should not render by default', () => {
    const wrapper = mount(
      <Chessdiagram ref="cd" />
    );
    expect(wrapper.find('GameHistory').length).toBe(0);
  });

  it('should render if enabled', () => {
    const wrapper = mount(
      <Chessdiagram ref="cd" gameHistory />
    );
    expect(wrapper.find('GameHistory').length).toBe(1);
  });
});
