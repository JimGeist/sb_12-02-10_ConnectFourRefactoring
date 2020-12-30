/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */



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

    this.pxBoardVal = "";
    this.p1Color = "";
    this.p1BoardVal = 1;
    this.p2Color = "";
    this.p2BoardVal = 2;


    this.playerReset();

    this.HEIGHT = +inHeight;
    this.WIDTH = +inWidth;

    this.gameOver = true;

    this.bindButtonStart();


  }


  getBoardHeight() {
    return this.HEIGHT;
  }


  getBoardWidth() {
    return this.WIDTH;
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


  playerSwap() {

    // swap the players
    this.pxBoardVal === this.p1BoardVal ? this.pxBoardVal = this.p2BoardVal : this.pxBoardVal = this.p1BoardVal;

  }


  playerReset() {

    this.pxBoardVal = this.p1BoardVal;

  }


  playerGetColor() {

    // return the color for the current player
    if (this.pxBoardVal === this.p1BoardVal) {
      return this.p1Color;
    } else {
      return this.p2Color;
    }

  }

  playerSetColor(inPlayer, inColor) {

    // sets the color for the identified player
    if (inColor.length > 0) {
      if (inPlayer === 1) {
        // make sure color is already in play
        // UI should also enforce
        if (inColor !== this.p2Color) {
          this.p1Color = inColor;
        }

      } else {
        // it is only a 2 player game, so this must be 2
        if (inColor !== this.p1Color) {
          this.p2Color = inColor;
        }

      }

    }

  }


  playerGetNumber() {

    // return the number for the current player
    if (this.pxBoardVal === this.p1BoardVal) {
      return this.p1BoardVal;
    } else {
      return this.p2BoardVal;
    }

  }


  // Make the game board
  makeBoard() {

    this.board = [];
    for (let y = 0; y < this.getBoardHeight(); y++) {
      this.board.push(Array.from({ length: this.getBoardWidth() }));
    }

  }


  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.getBoardHeight() - 1; y >= 0; y--) {
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
    piece.style.backgroundColor = this.playerGetColor();
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
      //  - returns true if all are legal coordinates & all match the player
      //    returned by playerGetNumber (the current player)

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.getBoardHeight() &&
          x >= 0 &&
          x < this.getBoardWidth() &&
          this.board[y][x] === this.playerGetNumber()
      );
    };

    for (let y = 0; y < this.getBoardHeight(); y++) {
      for (let x = 0; x < this.getBoardWidth(); x++) {
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
      this.board[y][x] = this.playerGetNumber();
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        this.setGameIsOver();
        return this.endGame(`Player ${this.playerGetNumber()} (${this.playerGetColor()}) won!`);

      }

      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        this.setGameIsOver();
        return this.endGame('Tie!');
      }

      // switch players
      this.playerSwap();

    }
  }


  handleStartButton(evt) {

    // Start a new game / restart a game
    // player is reset to 1
    // board array is rebuilt
    // html board is rebuilt
    // gameOver flag is set to false

    if (this.playerGetColor() === "") {
      console.log("do color stuff")
      const frmSelectP1 = document.getElementById("p1-colors");
      const frmSelectP2 = document.getElementById("p2-colors");
      this.playerSetColor(1, frmSelectP1.value);
      this.playerSetColor(2, frmSelectP2.value);

      const colorSelect = document.getElementById("color-selection")
      colorSelect.classList.add("hide");

    }

    this.playerReset();
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

    for (let x = 0; x < this.getBoardWidth(); x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.getBoardHeight(); y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.getBoardWidth(); x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }

  }


}

let game6x7 = new Game(6, 7, "black", "green")
