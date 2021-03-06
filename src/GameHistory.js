import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class MovetextViewer extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.rows.length !== nextProps.rows.length ||
        this.props.halfMove !== nextProps.halfMove
      ) {
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
    // return a fn that renders a cell w/ appropriate highlighting, 0 for white 1 for black
    const renderCell = (color) => {
      return ({value, rowValues, row, index, viewIndex}) => {
        const fullMove = Math.floor(this.props.halfMove / 2);
        const activeMove = fullMove === row[0] && (this.props.halfMove) % 2 === color;
        const backgroundColor = activeMove ? 'yellow' : '#FFF'
        return (
          <span
            ref={(cell) => {if (activeMove){this.activeMove = cell;}}}
            style={{backgroundColor}}
          >
            {value}
          </span>
        );
      };
    }
    const columnDefaults = {
      sortable: false
    }
    const columns = [{
      accessor: '0',
      id: 'move',
      width: 40
    },{
      accessor: '1',
      id: 'white',
      width: 90,
      render: renderCell(0)
    }, {
      accessor: '2',
      id: 'black',
      width: 90,
      render: renderCell(1)
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

MovetextViewer.PropTypes = {
  rows: React.PropTypes.array,
  halfMove: React.PropTypes.number
}

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

PgnControls.PropTypes = {
  moveHead: React.PropTypes.func.isRequired
}

class GameHistory extends Component {

  constructor(props) {
    super(props);
    const headerRegex = new RegExp('^(' + props.newlineChar + '|.)*' +
                                   '(?:'+ props.newlineChar +'){2}');
    const movetextRegex = new RegExp('(?:' + props.newlineChar + '){2}' +
                                     '(' + props.newlineChar + '|.)*$');
    const rows = this._parseMoveText(this.movetextRegex.exec(props.pgn)[0]);
    const halfMove = rows.length * 2 + (rows[rows.length - 1].length - 1) - 1;
    // console.log('halfMove', halfMove, rows.length * 2, rows[rows.length - 1]);
    this.state = {
      header: this.headerRegex.exec(props.pgn),
      movetext: this.movetextRegex.exec(props.pgn),
      rows: rows,
      halfMove: halfMove
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pgn !== this.props.pgn) {
      const rows = this._parseMoveText(this.movetextRegex.exec(nextProps.pgn)[0]);
      const halfMove = rows.length * 2 + (rows[rows.length - 1].length - 1) - 1;
      this.setState({rows, halfMove})
    }
  }

  _onMovePgnHead(evt) {
    const limit = Number(evt.target.value);
    let currentHalfMove = this.state.halfMove;
		const direction = limit > 0 ? 1 : -1;
		for (let i = 0; i !== limit; i += direction) {
			const result = this.props.moveHead(direction);
			if (!result) {break;} else {
        currentHalfMove += direction;
        this.setState({halfMove: currentHalfMove});
      }
		}
  }

  _parseMoveText(movetext) {
    /* delete comments */
    let ms = movetext.replace(/(\{[^}]+\})+?/g, '');
    /* delete recursive annotation variations */
    const rav_regex = /(\([^\(\)]+\))+?/g;
    while (rav_regex.test(ms)) {
      ms = ms.replace(rav_regex, '');
    }
    /* delete numeric annotation glyphs */
    ms = ms.replace(/\$\d+/g, '');
    /* Delete result */
    ms = ms.replace(/(?:1-0|0-1|1\/2-1\/2|\*)$/, '').trim();
    const rows = [];
    const row_regex = /\d+\.\s?\S+(?:\s\S+)?/g;
    while (true) {
      const result = row_regex.exec(ms);
      if (!result) {break;}
      const row = result[0].split(/\s|\.\s?/g);
      row[0] = parseInt(row[0])
      rows.push(row)
    }
    return rows;
  }

  get header() {
    const result = this.headerRegex.exec(this.props.pgn);
    return result ? result[0] : '';
  }

  get movetext() {
    const result =  this.movetextRegex.exec(this.props.pgn);
    // console.log('movetext result', result);
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
    const regex = new RegExp(/(?:1-0|0-1|1\/2-1\/2|\*)$/)
    return this.props.pgn.match(regex)[0]
  }

  render () {
    return (
      <div style={{display: 'inline-block', position: 'absolute', marginLeft: 5}}>
        <MovetextViewer
          halfMove={this.state.halfMove}
          rows={this.state.rows}
        />
        <PgnControls moveHead={this._onMovePgnHead.bind(this)}/>
      </div>
    );
  }
}

GameHistory.PropTypes = {
  moveHead: React.PropTypes.func,
  pgn: React.PropTypes.string,
}

export default GameHistory;
