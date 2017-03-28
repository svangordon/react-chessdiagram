import React, { Component } from 'react';

class PgnViewer extends Component {
  render () {
    return (
      <table>
        <tbody>
          {this.props.pgn.map((row, i) => (
            <tr key={i}>
              {row.split(' ').map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

PgnViewer.PropTypes = {
  pgn: React.PropTypes.string
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

  render () {
    console.log(this.props.pgn)
    return (
      <div style={{display: 'inline-block', position: 'absolute'}}>
        <PgnViewer
          pgn={this.props.pgn.split('\n').filter(row => row[0] !== '[')}
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
