import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class MovetextViewer extends Component {
  render () {
    const columnDefaults = {
      sortable: false
    }
    const columns = [{
      accessor: 'move',
      width: 40
    },{
      accessor: 'white',
      width: 90
    }, {
      accessor: 'black',
      width: 90
    }].map(column => Object.assign({}, columnDefaults, column));
    return (
      <div style={{height: 200, overflow: 'scroll'}}>
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
  rows: React.PropTypes.array
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
    this.state = {
      header: this.headerRegex.exec(props.pgn),
      movetext: this.movetextRegex.exec(props.pgn),
      rows: this._parseMoveText(this.movetextRegex.exec(props.pgn)[0])
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pgn !== this.props.pgn) {
      this.setState({rows: this._parseMoveText(this.movetextRegex.exec(nextProps.pgn)[0])})
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
    ms = ms.replace(/(?:1-0|0-1|1\/2-1\/2|\*)$/, '');

    const rows = [];
    const row_regex = /\d+\.\s?\S+\s\S+/g;
    while (true) {
      const result = row_regex.exec(ms);
      if (result) {
        const row = result[0].split(/\s|\./);
        rows.push({
          move: row[0],
          white: row[1],
          black: row[2]
        });
      } else {
        break;
      }
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
      <div style={{display: 'inline-block', position: 'absolute'}}>
        <MovetextViewer
          rows={this.state.rows}
        />
        <PgnControls moveHead={this.props.moveHead}/>
      </div>
    );
  }
}

GameHistory.PropTypes = {
  moveHead: React.PropTypes.func,
  pgn: React.PropTypes.string,
}

export default GameHistory;
