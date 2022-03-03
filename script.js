


const gameGridModule = (() => {
    const cellValues = [0,1,2,3,4,5,6,7,8];

    const updateCellValue = (PieceChoice, cellRef) => {
        // update the array values
        cellValues[cellRef] = PieceChoice;
        // update the GUI cell:
        cellToUpdate = document.querySelector(`[data-gridRef='${cellRef}']`);
        cellToUpdate.textContent = PieceChoice;
        }
        
    const gameGrid = document.querySelector('.gameGrid');
    
    const createGameGrid = () => {
            
      // create the initial grid on loading of the page
            let arrayRef = 0;
            for (row = 1; row <= 3; row++ ) {
            let col = 0;
            newGameGridRow = document.createElement(`div`);
            newGameGridRow.classList.toggle(`gameGridRow`);
            gameGrid.appendChild(newGameGridRow);
        
            for (cell = 1; cell <= 3; cell++ ) {
                col++
                newGameGridCell = document.createElement(`div`);
                newGameGridCell.classList.toggle(`gameGridCell`);
                newGameGridCell.setAttribute('data-gridRef', `${arrayRef}`);
                newGameGridRow.appendChild(newGameGridCell);
                newGameGridCell.addEventListener('click', gameGridCellClick);
                newGameGridCell.addEventListener('mouseenter', function(e) {
                    e.target.classList.add('gameGridCellMouseAnim');
                });
                newGameGridCell.addEventListener('mouseleave', function(e) {
                    e.target.classList.remove('gameGridCellMouseAnim');
                });
                arrayRef++;
            }
        }
        
    }


// update the cell and kick off the move actions when a cell is clicked
    function gameGridCellClick (e) {

        cellRef = e.target.dataset.gridref;
        if(e.target.textContent == "") {
            thisGame.PlayerHasATurn(thisGame.activePlayer, cellRef);    
        } else {
            alert('Please choose a free square');
        }
        
        
    }

// Reset the cell values to default values
    const resetGame = () => {
        for (i = 0; i < 9; i++) {
            cellValues[i] = i;
        }
        // delete the dom elements that represent the previous game
        const gameGridToDelete = document.querySelector(".gameGrid");    
        while (gameGridToDelete.firstChild) {
            gameGridToDelete.removeChild(gameGridToDelete.firstChild);
            }
        // now recreate the game grid
        createGameGrid();
    }

    const updateGameStatus = (userPlayerName, userPieceChoice) => {
        const gameStatus = document.querySelector('.gameStatus');
        gameStatus.textContent = `${userPlayerName}: ${userPieceChoice}`;
    }




  

return {createGameGrid, cellValues, updateCellValue, resetGame, updateGameStatus}

})();

const player = (name, PieceChoice) => {
    return {name, PieceChoice};
 };

 


 const newGame = () => {
    
    const playerOne = player("User", "O");
    const playerTwo = player("Computer", "X");
    
    const PlayerHasATurn = (activePlayer, cellRef) => {
      
      gameGridModule.updateCellValue(activePlayer.PieceChoice, cellRef);
        
        
      let playerOnePiece = playerOne.PieceChoice;
      let playerTwoPiece = playerTwo.PieceChoice;


        // check if the user player has won
      if (winCheck(gameGridModule.cellValues, playerOnePiece) == true) {
          DOMactivities.winModalShow("You win! Play Again?");
          return;
      }
      if (freeCells(gameGridModule.cellValues).length == 0) {
          DOMactivities.winModalShow("It's a tie.  Play Again?");
          return;
        }
        let playerTwoBestCellRef = minimax(gameGridModule.cellValues, playerTwoPiece).index;
        gameGridModule.updateCellValue(thisGame.playerTwo.PieceChoice, playerTwoBestCellRef);
        if (winCheck(gameGridModule.cellValues, playerTwoPiece) == true) {
          DOMactivities.winModalShow("Oh No! Computer wins.  Play Again?");
          return;
        }


        function minimax(newBoard, piece) {
            
            let emptyCells = freeCells(newBoard);

            if (winCheck(newBoard, playerOnePiece)) {
              return {
                score: -100
              };
            } else if (winCheck(newBoard, playerTwoPiece)) {
              return {
                score: 100
              };
            } else if (emptyCells.length === 0) {
              return {
                score: 0
              };
            }
            
          
            let moves = [];
            for (i = 0; i < emptyCells.length; i++) {
              let move = {};
              move.index = newBoard[emptyCells[i]];
              newBoard[emptyCells[i]] = piece;
          
              if (piece == playerTwoPiece) {
                let miniMaxScore = minimax(newBoard, playerOnePiece);
                move.score = miniMaxScore.score;
              } else {
                var miniMaxScore = minimax(newBoard, playerTwoPiece);
                move.score = miniMaxScore.score;
              }
              newBoard[emptyCells[i]] = move.index;
              moves.push(move);
            }
          
            var bestMove;
            if (piece === playerTwoPiece) {
              var bestScore = -10000;
              for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                  bestScore = moves[i].score;
                  bestMove = i;
                }
              }
            } else {
              var bestScore = 10000;
              for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                  bestScore = moves[i].score;
                  bestMove = i;
                }
              }
            }
            return moves[bestMove];
          }
          
          
          function freeCells(newBoard) {
            return newBoard.filter(s => s != "X" && s != "O");
          }
          
          
          // check for a Win
          function winCheck(newBoard, piece) {
            let playerWinningString = `${piece}${piece}${piece}`;
            if (
              (`${newBoard[0]}${newBoard[1]}${newBoard[2]}` == playerWinningString) ||
              (`${newBoard[3]}${newBoard[4]}${newBoard[5]}` == playerWinningString) ||
              (`${newBoard[6]}${newBoard[7]}${newBoard[8]}` == playerWinningString) ||
              (`${newBoard[0]}${newBoard[3]}${newBoard[6]}` == playerWinningString) ||
              (`${newBoard[1]}${newBoard[4]}${newBoard[7]}` == playerWinningString) ||
              (`${newBoard[2]}${newBoard[5]}${newBoard[8]}` == playerWinningString) ||
              (`${newBoard[0]}${newBoard[4]}${newBoard[8]}` == playerWinningString) ||
              (`${newBoard[2]}${newBoard[4]}${newBoard[6]}` == playerWinningString)
            ) {
              return true;
            } else {
              return false;
            }
          }

        ///////////////////////////////////////////////////
        ///////////////////////////////////////////////////
        ///////////////////////////////////////////////////
        ///////////////////////////////////////////////////

        
    }
   
               
    

    gameGridModule.resetGame();
    gameGridModule.updateGameStatus(playerOne.name, playerOne.PieceChoice);


    
    return {playerOne, playerTwo, PlayerHasATurn};
}


const DOMactivities = (() => {

const gameGrid = document.querySelector('.gameGrid');
const winModal = document.querySelector(".winModalContainer");
const resultMessage = document.querySelector(".winModalResultMessage");
const newGameButtons = document.querySelectorAll(".newGameButtons");
newGameButtons.forEach(e => e.addEventListener("click", function (e) {
  newGame();
  winModal.classList.remove('winModalContainerVisible');
}));

newGameButtons.forEach(e => e.addEventListener("mouseenter", function (e) {
  e.target.classList.add('newGameButtonsMouseEnter');
}));

newGameButtons.forEach(e => e.addEventListener("mouseleave", function (e) {
  e.target.classList.remove('newGameButtonsMouseEnter');
}));

const winModalButton = document.querySelector(".winModalButton");
const winModalShow = function winModalShow(message) {
  winModal.classList.add('winModalContainerVisible');
  resultMessage.textContent = message;
  winModalButton.addEventListener("click", function (e) {
    newGame();
    winModal.classList.remove('winModalContainerVisible');
  });
}




return {winModalShow}
})();


let thisGame = newGame();
thisGame.activePlayer = thisGame.playerOne;

