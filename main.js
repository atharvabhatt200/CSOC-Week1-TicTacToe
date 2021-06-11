var origBoard;
var origBoard1;
var cpuFirst = true;
var singlePlayer;
var huPlayer = 'X';
var aiPlayer = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
var X_CLASS = 'X';
var O_CLASS = 'O';
const cells = document.querySelectorAll('.cell');
var scoreX = scoreO = scorehuPlayer = scoreAI = 0
let circleTurn

showPlayers()

function chooseX() {
	X_CLASS = 'X';
	O_CLASS = 'O';
	huPlayer = 'X';
	aiPlayer = 'O';
	startGame();
}

function chooseO() {
	X_CLASS = 'O';
	O_CLASS = 'X';	
	huPlayer = 'O';
	aiPlayer = 'X';
	startGame();
}

function CPU() {
	document.querySelector(".first").style.display = "none";
	cpuFirst = true;
	firstSymbol1();
}

function human() {
	document.querySelector(".first").style.display = "none";
	cpuFirst = false;
	firstSymbol1();
}

function showPlayers() {
	document.querySelector(".players").style.display = "block";
}

function firstSymbol1() {
	document.querySelector(".first").style.display = "none";
	document.querySelector(".symbol").style.display = "block";
	document.querySelector(".symbol .text").innerText = "Choose your Symbol:";
}

function firstSymbol2() {
	singlePlayer = false;
	document.querySelector(".players").style.display = "none";
	document.querySelector(".symbol").style.display = "block";
	document.querySelector(".symbol .text").innerText = "First Symbol:";
}

function firstMove() {
	singlePlayer = true;
	document.querySelector(".players").style.display = "none";
	document.querySelector(".first").style.display = "block";
	document.querySelector(".first .text").innerText = "First Move:";
}

function startGame() {
	document.querySelector(".symbol").style.display = "none";
	document.querySelector(".endgame").style.display = "none";
	if(singlePlayer) startGame1();
	else startGame2();
}

function startGame1() {
	document.querySelector(".tictactoe").style.display = "block";
	document.querySelector(".score").style.display = "block";
	document.querySelector(".players").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	var j;
	if(cpuFirst) {
		j = Math.floor(Math.random() * 9);
		console.log(j);
		cells[j].innerText = '';
		cells[j].style.removeProperty('background-color');
		setTimeout(function(){
			turn(j, aiPlayer);
		}, 200);
	}	
	for (var i = 0; i < cells.length; i++) {
		if(i==j) continue;
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, {once: true});
	}
	document.querySelector(".score .score1").innerText = scorehuPlayer;
	document.querySelector(".score .score2").innerText = scoreAI;
}

function startGame2() {
	circleTurn = false
	document.querySelector(".tictactoe").style.display = "block";
	document.querySelector(".score").style.display = "block";
	document.querySelector(".players").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', handleClick, {once: true});
	}
	document.querySelector(".score .score1").innerText = scoreX;
	document.querySelector(".score .score2").innerText = scoreO;
}

function handleClick(square) {
	const currentClass = circleTurn ? O_CLASS : X_CLASS
    if (typeof origBoard[square.target.id] == 'number') {
		placeMark(square.target.id, currentClass)
	}
	if(checkWin(origBoard,currentClass)) return;
	else if(checkTie()) declareWinner("Tie Game!");
	else swapTurns();
}

function placeMark(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver2(gameWon)
}

function swapTurns(){
	circleTurn = !circleTurn
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
	if(checkWin(origBoard,aiPlayer)) return;
	else if(checkTie()) declareWinner("Tie Game!");
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	gameWon.player == huPlayer ? (scorehuPlayer+=1) : (scoreAI+=1);
	document.querySelector(".score .score1").innerText = scorehuPlayer;
	document.querySelector(".score .score2").innerText = scoreAI;
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function gameOver2(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == X_CLASS ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', handleClick, false);
	}
	gameWon.player == X_CLASS ? (scoreX+=1) : (scoreO+=1);
	document.querySelector(".score .score1").innerText = scoreX;
	document.querySelector(".score .score2").innerText = scoreO;
	declareWinner(gameWon.player == X_CLASS ? ("Player "+X_CLASS+" Wins!") : ("Player "+O_CLASS+" Wins!"));
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}