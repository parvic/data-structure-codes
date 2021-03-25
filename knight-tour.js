const boardSize = 8;

let knight = {
  possibleMoves: [],
  tour: [],
  arrayOfPosition: []
}

function initializeChessBoard() {
  let chessBoard = new Array(boardSize)
  
  for (let column = 0; column < boardSize; column++) {
    chessBoard[column] = new Array(boardSize);
    for (let row = 0; row < boardSize; row++) {
      chessBoard[column][row] = -1;
    }
  }
  return chessBoard;
}

function convertNumberPositionToLetter(rowPosition) {
  switch (rowPosition) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return 'G';
    case 7:
      return 'H';
    default:
      return -1;
  }
}

function convertLetterPositionToNumber(columnPosition) {
  switch (columnPosition) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    case 'E':
      return 4;
    case 'F':
      return 5;
    case 'G':
      return 6;
    case 'H':
      return 7;
    default:
      return -1;
  }
}

function invertRowPositions(rowPosition) {
  return Math.abs(rowPosition - boardSize);
}

function convertPositionToMatrix(position) {
  const [column, row] = position.split('');
  
  const newRow = convertLetterPositionToNumber(column);
  const newColumn = invertRowPositions(row);

  return [newColumn, newRow];
}

// Drawing code
function drawStaticBoard(chessBoard) {

  console.log('The Knight Tour on Chess Board:');
  var columnLetters = '     '

  for (let i = 0; i < boardSize; i++) {
    var printRow = `(#${invertRowPositions(i)}) `
    columnLetters += `(#${convertNumberPositionToLetter(i)})`
    for (let j = 0; j < boardSize; j++) {
      var position = chessBoard[i][j].toLocaleString('en-US',{ minimumIntegerDigits:2})
      printRow += String(`[${position}]`);
    }
    console.log(printRow);
  }
  console.log(columnLetters);
}


async function drawDynamicBoard(chessBoard, column, row) {
  
  // console.clear();
    
  var columnLetters = '     '
  for (let i = 0; i < boardSize; i++) {
    var printRow = `(#${invertRowPositions(i)}) `
    columnLetters += `(${convertNumberPositionToLetter(i)})`
    for (let j = 0; j < boardSize; j++) {
      
      if(chessBoard[i][j] === -1){
        printRow += String(`[ ]`);
      } else {
        if (chessBoard[i][j] === knight.tour.length){
        printRow += String(`[\u2658]`); // Chess knight unicode
        } else {
          printRow += String(`[X]`);
        }
      }
    }
    console.log(printRow);
  }
  console.log(columnLetters + '\n');
}


// Movement-based code
function getPossibleMoves(columnPosition, rowPosition) {
  const moves = [
    [columnPosition - 2, rowPosition - 1], // left-top
    [columnPosition - 1, rowPosition - 2], // top-left
    [columnPosition + 1, rowPosition - 2], // top-right
    [columnPosition + 2, rowPosition - 1], // right-top
    [columnPosition + 2, rowPosition + 1], // right-bottom
    [columnPosition + 1, rowPosition + 2], // bottom-right
    [columnPosition - 1, rowPosition + 2], // bottom-left
    [columnPosition - 2, rowPosition + 1], // left-bottom
  ]
  return moves.filter((move) => {
    return move[0] >= 0 && move[1] >= 0 && move[0] < boardSize && move[1] < boardSize;
  })
}

function checkIfMoveIsAllowed(column, row, chessBoard) {
  return chessBoard[column][row] === -1 ? true : false
}

// Recursive function to to check
function knightTour(column, row, chessBoard){
  const currentChessBoard = chessBoard
  
  if(knight.tour.length === boardSize ** 2){
    return true;
  }
  
  knight.possibleMoves = getPossibleMoves(column, row);
  
  knight.possibleMoves.forEach(move => {
    if(checkIfMoveIsAllowed(move[0], move[1], currentChessBoard)) {
      const position = String(convertNumberPositionToLetter(move[1]) + invertRowPositions(move[0]));
      knight.tour.push(position);
      currentChessBoard[move[0]][move[1]] = knight.tour.length;
      drawDynamicBoard(currentChessBoard, move[0], move[1]);

      if(knightTour(move[0], move[1], currentChessBoard)) {
        return true;
      } 
    }
  });
  return false;
}

function startKnightTour(column, row) {

  let chessBoard = initializeChessBoard();

  const position = String(convertNumberPositionToLetter(row) + invertRowPositions(column));
  knight.tour.push(position)
  chessBoard[column][row] = knight.tour.length;
  drawDynamicBoard(chessBoard, column, row);

  knightTour(column, row, chessBoard)
  
  console.log('Sequence of Positions:');
  console.log(knight.tour);
  drawStaticBoard(chessBoard);
}


// User input arguments
var arguments = process.argv
if(arguments.length === 3) {
  const [column, row] = convertPositionToMatrix(arguments[2]);
  startKnightTour(column, row);
}

