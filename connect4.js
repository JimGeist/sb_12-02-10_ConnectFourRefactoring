/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let currPlayer = 1; // active player: 1 or 2

class Game {

  constructor(inHeight, inWidth) {

    // test for numbers
    if ((!Number.isInteger(inHeight)) || (!Number.isInteger(inWidth))) {

      for (let currObj of [{ inVal: "height", value: inHeight }, { inVal: "width", value: inWidth }]) {

        let nbrCheck = +currObj.value;
        if (!(nbrCheck)) {
          throw new Error(`Board ${currObj.inVal} '${currObj.value}' is not numeric`);
        }

      }
    }

    // board size cannot be less than 4 in either height or width 
    if ((+(inHeight) < 4) || (+(inWidth) < 4)) {

      for (let currObj of [{ inVal: "height", value: +(inHeight) }, { inVal: "width", value: +(inWidth) }]) {

        if (currObj.value < 4) {
          throw new Error(`Board ${currObj.inVal} of ${currObj.value} invalid. Board ${currObj.inVal} MUST be 4 or greater for Connect Four`);
        }

      }
    }

    this.HEIGHT = +inHeight;
    this.WIDTH = +inWidth;

    this.gameOver = true;

    this.bindButtonStart();

    //this.makeBoard();
    //this.makeHtmlBoard();

    //console.log("end of Constructor");

  }

  isGameOver() {
    return this.gameOver;
  }

  setGameIsOver() {
    this.gameOver = true;
  }

  setGameIsNotOver() {
    this.gameOver = false;
  }

  // Make the game board
  makeBoard() {

    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }

  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }


  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }


  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }


  checkForWin() {

    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === currPlayer
      );
    };

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }


  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if (!this.isGameOver()) {

      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        this.setGameIsOver();
        return this.endGame(`Player ${currPlayer} won!`);

      }

      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        this.setGameIsOver();
        return this.endGame('Tie!');
      }

      // switch players
      currPlayer = currPlayer === 1 ? 2 : 1;

    }
  }


  handleStartButton(evt) {

    // Start a new game / restart a game
    // player is reset to 1
    // board array is rebuilt
    // html board is rebuilt
    // gameOver flag is set to false

    currPlayer = 1;

    this.makeBoard();
    const board = document.getElementById('board');
    board.innerHTML = '';
    this.makeHtmlBoard();

    this.setGameIsNotOver();

  }


  bindButtonStart() {

    const btnStart = document.getElementById('start-button');
    this.boundHandleButtonStart = this.handleStartButton.bind(this);
    btnStart.addEventListener('click', this.boundHandleButtonStart);

  }


  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    const btnStart = document.getElementById('start-button');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    this.boundHandleClick = this.handleClick.bind(this);
    top.addEventListener('click', this.boundHandleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }

  }


  getBoardHeight() {
    return this.HEIGHT;
  }


  getBoardWidth() {
    return this.WIDTH;
  }

}

let game42 = new Game(6, 7)
