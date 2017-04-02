import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class MovetextViewer extends Component {
  render () {
    const columnDefaults = {
      sortable: false
    }
    const columns = [{
      accessor: 'move'
    },{
      accessor: 'white'
    }, {
      accessor: 'black'
    }].map(column => Object.assign({}, columnDefaults, column));
    console.log(this.props.rows)
    return (
      <div style={{height: 200, overflow: 'scroll'}}>
        <ReactTable
          data={this.props.rows}
          columns={columns}
          showPagination={false}
          defaultPageSize={this.props.rows.length}
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
      movetext: this.movetextRegex.exec(props.pgn)
    };
    // this.header = this.headerRegex.exec(props.pgn);
    // this.movetext = this.movetextRegex.exec(props.pgn);
    // console.log('state', this.state)
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
    // console.log(this.props.pgn);
    // console.log(this.header);
    // console.log(this.movetext)
    // console.log(this.headerRegex.exec(this.props.pgn));
    // console.log(this.movetextRegex.exec(this.props.pgn))
    // console.log(this.result);
    /* delete comments */
    let ms = this.movetext.replace(/(\{[^}]+\})+?/g, '');

    /* delete recursive annotation variations */
    const rav_regex = /(\([^\(\)]+\))+?/g;
    while (rav_regex.test(ms)) {
      ms = ms.replace(rav_regex, '');
    }

    /* delete numeric annotation glyphs */
    ms = ms.replace(/\$\d+/g, '');
    console.log('ms0', ms);

    /* Delete result */
    ms = ms.replace(/(?:1-0|0-1|1\/2-1\/2|\*)$/, '');

    const rows = [];
    const row_regex = /\d+\.\s\S+\s\S+/g;
    while (true) {
      const result = row_regex.exec(ms);
      if (result) {
        const row = result[0].split(' ');
        console.log(row)
        rows.push({
          move: row[0],
          white: row[1],
          black: row[2]
        });
      } else {
        break;
      }
    }
    console.log('rows', rows);
    console.log('ms',ms)

    return (
      <div style={{display: 'inline-block', position: 'absolute'}}>
        <MovetextViewer
          rows={rows}
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
