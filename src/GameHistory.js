import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class MovetextViewer extends Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.rows.length !== nextProps.rows.length ||
        this.props.halfMove !== nextProps.halfMove) {
			return true;
		}
		return false;
	}

	componentDidMount() {
		this._scrollToActiveMove();
	}

	componentDidUpdate() {
		this._scrollToActiveMove();
	}

	_scrollToActiveMove() {
		if (this.activeMove)
			this.pgnContainer.scrollTop = this.activeMove.offsetTop;
		else
      this.pgnContainer.scrollTop = 0;
	}

	render () {
    // return a fn that renders a cell w/ appropriate highlighting, 1 for white 2 for black
		const renderCell = (color) => {
			return ({value, row}) => {
				const cellMove = (row[0]-1)*2 + color;
				const backgroundColor = cellMove === this.props.halfMove ? 'yellow' : '#FFF';
				return (
          <span
            className={'pgn-cell'}
            onClick={() => this.props.moveHead(cellMove)}
            ref={(cell) => {if (cellMove === this.props.halfMove){this.activeMove = cell;}}}
            style={{backgroundColor}}
          >
            {value}
          </span>
				);
			};
		};
		const columnDefaults = {
			sortable: false
		};
		const columns = [{
			accessor: '0',
			id: 'move',
			width: 40
		},{
			accessor: '1',
			id: 'white',
			width: 90,
			render: renderCell(1)
		}, {
			accessor: '2',
			id: 'black',
			width: 90,
			render: renderCell(2)
		}].map(column => Object.assign({}, columnDefaults, column));
		return (
      <div
        ref={(pgnContainer) => {this.pgnContainer = pgnContainer;}}
        style={{height: 200, overflowY: 'scroll'}}
      >
        <ReactTable
          data={this.props.rows}
          columns={columns}
          showPagination={false}
          pageSize={this.props.rows.length}
        />
      </div>
		);
	}
}

MovetextViewer.propTypes = {
	rows: React.PropTypes.array,
	halfMove: React.PropTypes.number,
	moveHead: React.PropTypes.func
};

class PgnControls extends Component {
	render() {
		return (
      <div>
        <button value={-Infinity} onClick={this.props.moveHead}>{"|<"}</button>
        <button value={-1} onClick={this.props.moveHead}>{"<"}</button>
        <button value={1} onClick={this.props.moveHead}>{">"}</button>
        <button value={Infinity} onClick={this.props.moveHead}>{">|"}</button>
      </div>
		);
	}
}

PgnControls.propTypes = {
	moveHead: React.PropTypes.func.isRequired
};

class GameHistory extends Component {

	constructor(props) {
		super(props);
		const rows = this.rows//props.pgn ? this._parseMovetext(this.movetextRegex.exec(props.pgn)[0]) : [];
		const maxMove = props.pgn ? (rows.length - 1) * 2 + (rows[rows.length - 1].length - 1) : 0;
		this.state = {
			header: this.headerRegex.exec(props.pgn),
			movetext: this.movetextRegex.exec(props.pgn),
			// rows: rows,
			maxMove: maxMove
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.pgn !== this.props.pgn) {
			const rows = nextProps.pgn ? this._parseMovetext(this.movetextRegex.exec(nextProps.pgn)[0]) : [];
			const maxMove = nextProps.pgn ? (rows.length - 1) * 2 + (rows[rows.length - 1].length - 1) : 0;
			this.setState({rows, maxMove});
		}
	}

	_onMovePgnHead(evt) {
		const limit = Number(evt.target.value);
		let currentHalfMove = this.props.currentMove;
		const direction = limit > 0 ? 1 : -1;
		let target;
		if (direction === 1) {
			target = Math.min(currentHalfMove + limit, this.state.maxMove);
		} else {
			target = Math.max(currentHalfMove + limit, 0); // Limit will be negative
		}
		this.props.moveHead(target);

	}

	get rows() {
		let ms = this.movetext;
		if (!ms) {
			return [];
		}
		// ms = headerRegex.exec(ms)[0]
		console.log('movetext regex', this.movetext);
    /* delete comments */
		ms = ms.replace(/(\{[^}]+\})+?/g, '');

    /* delete recursive annotation variations */
		const ravRegex = /(\([^\(\)]+\))+?/g;
		while (ravRegex.test(ms)) {
			ms = ms.replace(ravRegex, '');
		}

    /* delete numeric annotation glyphs */
		ms = ms.replace(/\$\d+/g, '');

    /* Delete result */
		ms = ms.replace(/(?:1-0|0-1|1\/2-1\/2|\*)$/, '');

		/* Delete any double spaces */
		ms = ms.replace(/\s\s/g, ' ').trim();

    /* Split into rows */
		const rows = [];
		const rowRegex = /\d+\.\s?\S+(?:\s+\S+)?/g;
		while (true) {
			const result = rowRegex.exec(ms);
			if (!result) {break;}
			const row = result[0].split(/\s|\.\s?/g);
			row[0] = parseInt(row[0]);
			rows.push(row);
		}
		return rows;
	}

	get header() {
		const result = this.headerRegex.exec(this.props.pgn);
		return result ? result[0] : '';
	}

	get movetext() {
		const result =  this.movetextRegex.exec(this.props.pgn);
		return result ? result[0] : '';
	}

	get headerRegex() {
		return new RegExp('^(' + this.props.newlineChar + '|.)*' +
                      '(?:'+ this.props.newlineChar +'){2}');
	}

	get movetextRegex() {
		return new RegExp('(?:' + this.props.newlineChar + '){2}' +
                      '(' + this.props.newlineChar + '|.)*$');
	}

	get result() {
    /* Return the game termination marker, which will be one of:
      1-0 | 0-1 | 1/2-1/2 | *
    */
		const regex = new RegExp(/(?:1-0|0-1|1\/2-1\/2|\*)$/);
		return this.props.pgn.match(regex)[0];
	}

	render () {
		return (
      <div style={{display: 'inline-block', position: 'absolute', marginLeft: 5}}>
        <MovetextViewer
          halfMove={this.props.currentMove}
          moveHead={this.props.moveHead}
          pgnHeight={this.props.pgnHeight}
          pgnWidth={this.props.pgnWidth}
          rows={this.rows}
        />
        <PgnControls moveHead={this._onMovePgnHead.bind(this)}/>
      </div>
		);
	}
}

GameHistory.propTypes = {
	currentMove: React.PropTypes.number,
	moveHead: React.PropTypes.func,
	newlineChar: React.PropTypes.string.isRequired,
	pgn: React.PropTypes.string,
	pgnHeight: React.PropTypes.number,
	pgnWidth: React.PropTypes.number,
	sloppy: React.PropTypes.bool
};

GameHistory.defaultProps = {
	newlineChar: '\r?\n',
	sloppy: false
};

export default GameHistory;
