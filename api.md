`Chessdiagram` (component)
==========================

Chessdiagram : draws a chess diagram consisting of a board and pieces, using svg graphics

Props
-----

### `darkSquareColor`

type: `string`
defaultValue: `"#005EBB"`


### `fen`

Chess position in FEN format (Forsyth-Edwards Notation). eg "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

type: `string`


### `files`

type: `number`
defaultValue: `8`


### `flip`

if true, rotates the board so that Black pawns are moving up, and White pawns are moving down the board

type: `bool`
defaultValue: `false`


### `height`

height of main svg container in pixels. If setting this manually, it should be at least 9 * squareSize to fit board AND labels

type: `union(string|number)`
defaultValue: `'auto'`


### `lightSquareColor`

type: `string`
defaultValue: `"#2492FF"`


### `onMovePiece`

callback function which is called when user moves a piece. Passes pieceType, initialSquare, finalSquare as parameters to callback

type: `func`


### `onSelectSquare`

callback function which is called when user clicks on a square. Passes name of square as parameter to callback

type: `func`


### `pieceDefinitions`

Optional associative array containing non-standard chess characters

type: `object`
defaultValue: `{}`


### `pieces`

array of pieces at particular squares (alternative to fen) eg ['P@f2','P@g2','P@h2','K@g1'].
This format may be more suitable for unconventional board dimensions, for which standard FEN would not work.
Note: If both FEN and pieces props are present, FEN will take precedence

type: `array`


### `ranks`

type: `number`
defaultValue: `8`


### `squareSize`

type: `number`
defaultValue: `45`


### `width`

width of main svg container in pixels. If setting this manually, it should be at least 9 * squareSize to fit board AND labels

type: `union(string|number)`
defaultValue: `'auto'`


`Board` (component)
===================

Board : draws a chess board with given square size, square colors, and number of files and ranks

Props
-----

### `darkSquareColor` (required)

type: `string`
defaultValue: `"#005EBB"`


### `files` (required)

type: `number`
defaultValue: `8`


### `flip` (required)

type: `bool`
defaultValue: `false`


### `lightSquareColor` (required)

type: `string`
defaultValue: `"#2492FF"`


### `ranks` (required)

type: `number`
defaultValue: `8`


### `selectedSquare`

type: `string`


### `squareSize` (required)

type: `number`
defaultValue: `45`


`Piece` (component)
===================

Piece: renders an svg chess piece of a given type and position

Props
-----

### `drawPiece` (required)

type: `func`


### `pieceType` (required)

type: `string`


### `squareSize` (required)

type: `number`


### `x` (required)

type: `number`


### `y` (required)

type: `number`


