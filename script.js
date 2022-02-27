


const gameGridModule = (() => {
    const cellValues = {
            11: "",
            12: "",
            13: "",
            21: "",
            22: "",
            23: "",
            31: "",
            32: "",
            33: "",
        }

    const updateCellValue = (PieceChoice, cellRef) => {
        // update the array values
        cellValues[cellRef] = PieceChoice;
        // update the GUI cell:
        cellToUpdate = document.querySelector(`[data-gridRef='${cellRef}']`);
        console.log(`cell = ${cellToUpdate} & piece = ${cellToUpdate}`);
        cellToUpdate.textContent = PieceChoice;
        // console.log(cellValues);
        }
        
    const gameGrid = document.querySelector('.gameGrid');
    const createGameGrid = () => {
        for (row = 1; row <= 3; row++ ) {
            let col = 0;
            newGameGridRow = document.createElement(`div`);
            newGameGridRow.classList.toggle(`gameGridRow`);
            gameGrid.appendChild(newGameGridRow);
        
            for (cell = 1; cell <= 3; cell++ ) {
                col++
                newGameGridCell = document.createElement(`div`);
                newGameGridCell.classList.toggle(`gameGridCell`);
                newGameGridCell.setAttribute('data-gridRef', `${row}${col}`);
                newGameGridCell.textContent = cellValues[`${row}${col}`];
                newGameGridRow.appendChild(newGameGridCell);
                newGameGridCell.addEventListener('click', gameGridCellClick);
                newGameGridCell.addEventListener('mouseenter', function(e) {
                    e.target.classList.add('gameGridCellMouseAnim');
                });
                newGameGridCell.addEventListener('mouseleave', function(e) {
                    e.target.classList.remove('gameGridCellMouseAnim');
                });
            }
        }
    }


    function gameGridCellClick (e) {
        cellRef = e.target.dataset.gridref;
        if(e.target.textContent == "") {
            console.log(thisGame.activePlayer);
            thisGame.PlayerHasATurn(thisGame.activePlayer, cellRef);    
        } else {
            alert('Please choose a free square');
        }
        
        
    }


    const resetGame = () => {
    // Reset the cell values to default values
    
        for (cell in cellValues) {
            cellValues[cell] = "";
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




   // possible win combinations:
   const updateWinCombos = () => {
    let wincombos = {
        row1: `${cellValues[11]}${cellValues[12]}${cellValues[13]}`,
        row2: `${cellValues[21]}${cellValues[22]}${cellValues[23]}`,
        row3: `${cellValues[31]}${cellValues[32]}${cellValues[33]}`,
        col1: `${cellValues[11]}${cellValues[21]}${cellValues[31]}`,
        col2: `${cellValues[12]}${cellValues[22]}${cellValues[32]}`,
        col3: `${cellValues[13]}${cellValues[23]}${cellValues[33]}`,
        diagR1C3: `${cellValues[11]}${cellValues[22]}${cellValues[33]}`,
        diagR3C3: `${cellValues[13]}${cellValues[22]}${cellValues[31]}`,  
    }
    return wincombos;
}

const updateDrawString = () => {
    let drawString = "";
    cellValuesArray = Object.values(cellValues);
    for (i = 0; i < cellValuesArray.length; i++ ) {
        if (cellValuesArray[i] == "") {
            drawString += "E"; // for Empty grid cell.  This allows for a string search for "E" to confirm if any cells are free to play.  I.e. is it a draw?
        } else {
            drawString += cellValuesArray[i];
        }
    }
    
    return drawString;
}

return {createGameGrid, cellValues, updateCellValue, resetGame, updateGameStatus, updateWinCombos, updateDrawString}

})();

const player = (name, PieceChoice) => {
    // set a string to compare against when checking for winning combos
    let playerTurnWinningString = "";
    for (i = 0; i < 3; i++) {
                playerTurnWinningString = `${PieceChoice}${PieceChoice}${PieceChoice}`;
            }

   

    console.log(`name = ${name} | piece = ${PieceChoice}`);

    
    

    return {name, PieceChoice, playerTurnWinningString};
 };

 


 const newGame = () => {
    gameGridModule.resetGame();
    function obtainUserPlayerInfo() {
        const name = "DD" // prompt("Please enter your name");
        let PieceChoice = "invalidString";
            do {
                PieceChoice = prompt("enter O or X");
            } while (PieceChoice != "X" && PieceChoice != "x" && PieceChoice != "O" && PieceChoice != "o");
    
        return {name, PieceChoice};
    }
    // gameGridModule.updateGameStatus();

    const userPlayerInfo = obtainUserPlayerInfo();
    const playerOne = player(userPlayerInfo.name, userPlayerInfo.PieceChoice);

        let compPieceChoice = "-";
        if (playerOne.PieceChoice == "O") {
            compPieceChoice = "X";
        } else {
            compPieceChoice = "O";
        }

    const playerTwo = player("Computer", compPieceChoice);
    gameGridModule.updateGameStatus(playerOne.name, playerOne.PieceChoice);
    
    let activePlayer = "";
    function updateActivePlayer(PieceChoice) {
            if (PieceChoice == playerOne.PieceChoice) {
                activePlayer = playerTwo;
                 console.log(`${PieceChoice} - ${playerTwo.PieceChoice}`)
                 console.log(`ACTIVE PLAYER = ${Object.values(activePlayer)}`);
            } else {
                activePlayer = playerOne;
                console.log(`ACTIVE PLAYER = ${Object.values(activePlayer)}`);  
            }
            return activePlayer;
        }
        

        
    const PlayerHasATurn = (activePlayer, cellRef) => {
        gameGridModule.updateCellValue(activePlayer.PieceChoice, cellRef);
        WinCombosStateAfterTurn = gameGridModule.updateWinCombos();
        currentResult = gameEndCheck();
        if (currentResult == 'win') {
            winModal.classList.add('winModalVisible');
        }
        // console.table(WinCombosStateAfterTurn);
        // console.log(gameGridModule.updateDrawString());
        
        function gameEndCheck () {
            let winCheck = Object.values(WinCombosStateAfterTurn).filter(function (el) {
                // console.log(`${el} - ${playerTurnWinningString}`)
                return el == activePlayer.playerTurnWinningString;
            });
                if (winCheck == activePlayer.playerTurnWinningString) {
                    return "win";
                } else if (gameGridModule.updateDrawString().includes("E")) {
                    return "continue";
                } else {
                    return "draw";
                }
        }

            
            
            // console.log(PieceChoice);
            thisGame.activePlayer = thisGame.updateActivePlayer(activePlayer.PieceChoice);
            if (thisGame.activePlayer == thisGame.playerTwo) {
                makeComputerMove(thisGame.activePlayer);
            }

            function makeComputerMove(computerPlayer) {
                let randomeCellRefArray = [];
                for (gridRef in gameGridModule.cellValues) {
                    if (gameGridModule.cellValues[gridRef] == "") {
                        randomeCellRefArray.push(gridRef);
                    }
                }               
                chosenCellArrayPos = Math.floor(Math.random() * randomeCellRefArray.length); 
                chosenCellForComputerTurn = randomeCellRefArray[chosenCellArrayPos];
                
                gameGridModule.updateCellValue(computerPlayer.PieceChoice, chosenCellForComputerTurn);
                
                thisGame.activePlayer = thisGame.updateActivePlayer(computerPlayer.PieceChoice);
                console.log(gameEndCheck());
            }

         }

    return {playerOne, playerTwo, updateActivePlayer, PlayerHasATurn};
}


 
const winModal = document.querySelector(".winModal");
const newGameButton = document.querySelector(".headerButtons");
newGameButton.addEventListener('click', newGame);
newGameButton.addEventListener('mouseenter', function(e) {
    e.target.classList.add('headerButtonsMouseEnter');
});
newGameButton.addEventListener('mouseleave', function(e) {
    e.target.classList.remove('headerButtonsMouseEnter');
});



let thisGame = newGame();
// console.log(thisGame);
thisGame.activePlayer = thisGame.updateActivePlayer("o");

// console.log(playerOne);
