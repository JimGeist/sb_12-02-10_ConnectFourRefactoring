# sb_12-02-10_ConnectFourRefactoring

## Connect Four OO Refactoring

Assignment involved taking the non-Object Oriented version of the Connect Four game (starter code supplied) and refactoring it into an OO version.

Please go to [Connect Four Refactoring](https://jimgeist.github.io/sb_12-02-10_ConnectFourRefactoring/) for the big game!

## Assignment Details
#Part One
Create a game class, Game, with all the code in the Game class. 
A new game is created via
```sh
new Game(6, 7);
```
where 6 is the board height and 7 is the board width.

# Part Two
Add a button to start a new game. The game should only start when the button is clicked and clicking the button at anytime will restart the game.
Add a property that prevents moves after the game has ended.

# Part Three
getBoardHeight() and getBoardWidth() methods were implemented. They were declared in the previous version, they just were never called. 
The players can select the color of their game piece (kinda sort-of). Each player is restricted to 6 possible colors. Player 1 has 'warm' colors (reds, oranges, yellows) while player 2 can select from 'cool' colors (blues, greens, violets).
Values that operate the game should ideally be accessed only through methods. 

