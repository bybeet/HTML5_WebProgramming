//array to hold array of squares. each index is an array of 9x9 sudoku squares
var grid=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];

//array to hold array of squares. each index is an array of 9x9 sudoku squares
var valuesEditable=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];

//array to hold absolute row by column sudoku grid
var gridRows=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];

//array to hold absolute column by row sudoku grid
var gridColumns=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
//array to hold sets of avaiable numbers for each square. sets[i] is the set of numbers avaiable to be added to

//each 9x9 sudoku square, whose number is i+1;
var sets; //=[generateNumbers(), generateNumbers(), generateNumbers(),generateNumbers(), generateNumbers(), generateNumbers(),generateNumbers(), generateNumbers(), generateNumbers()];

var idsInput;
var numBoxesInputted = 0;
//Stopwatch object, can be started with stopWatch.start(), stopped with stopWatch.stop()
var stopWatch = new StopWatch();

//Difficultly selected by user. 0=Easy, 1=Medium, 2=Hard
//  Set when user selects button, then used to reset the board
//  to the correct difficulty. Easy game by default.
var difficulty=0;

var currentFocusElementId = "";
var currentFocusElementBGColor = "";
var currentFocusElementIValue = -1;
var currentFocusElementJValue = -1;

function setEasy(){
    difficulty = 0;
    resetGame();
}

function setMedium(){
    difficulty = 1;
    resetGame();
}

function setHard(){
    difficulty = 2;
    resetGame();
}

//Recalculates numbers, randomly removes numbers based on difficults, displays numbers
//on the canvas, and starts the stopwatch.
function resetGame(){
    idsInput = new Object();
    calculateGrid();
    removeNumbers();
    styleGridElements();
    stopWatch.start();
    currentFocusElementId = "";
    currentFocusElementBGColor = "";
}

function setEventHandlers(){
    //Set buttons to call difficulty functions
    console.log("In setEventHandlers");
    document.getElementById("easyButton").addEventListener('click', setEasy, false);
    document.getElementById("mediumButton").addEventListener("click", setMedium, true);
    document.getElementById("hardButton").addEventListener("click", setHard, true);
    //document.getElementById("resetButton").addEventListener("click", resetGame, true);
}

//Sets handlers for new game buttons, initializes the canvas grid, and
//sets up the game.
window.onload = function(){
    setEventHandlers();

    initalizeHTMLGrid();
    resetGame();
    document.onkeydown = keyDown;
}
function changeSquareValue(valueToChangeTo){
	var canvasElement = document.getElementById(currentFocusElementId);
	var context = canvasElement.getContext("2d");
	var value = valueToChangeTo - 48;
	var gridVal = grid[currentFocusElementJValue - 1][currentFocusElementIValue - 1];
	var editable = valuesEditable[currentFocusElementJValue - 1][currentFocusElementIValue - 1];
	var completedGame = false;
	if(idsInput[currentFocusElementId] === undefined && editable){
		idsInput[currentFocusElementId] = true;
		numBoxesInputted++;
		if((numBoxesInputted === 20 && difficulty === 0) || (numBoxesInputted === 35 && difficulty === 1)
			|| (numBoxesInputted === 50 && difficulty === 2)){
			completedGame = true;
		}
	}else if(editable && ((numBoxesInputted === 20 && difficulty === 0) || (numBoxesInputted === 35 && difficulty === 1)
			|| (numBoxesInputted === 50 && difficulty === 2))){
		completedGame = true;
	}
	if(value >= 1 && value <= 9 && editable){
		context.fillStyle='#FFFFFF';
                context.fillRect(0,0,28,28);
		context.fillStyle = "#000000";
		context.font = "20px Arial";
		context.fillText(value,5,20);

		gridRows[(Math.floor((currentFocusElementJValue - 1) / 3) * 3) + Math.floor((currentFocusElementIValue - 1) / 3)][((currentFocusElementIValue - 1) % 3) + ((currentFocusElementJValue - 1) % 3 * 3)] = value;

		gridColumns[((currentFocusElementIValue - 1) % 3) + ((currentFocusElementJValue - 1) % 3 * 3)][(Math.floor((currentFocusElementJValue - 1) / 3) * 3) + Math.floor((currentFocusElementIValue - 1) / 3)] = value;			
		grid[currentFocusElementJValue - 1][currentFocusElementIValue - 1] = value;
	}
	if(completedGame){
		checkGameSuccess();
	}
}
function keyDown(e){
	if(currentFocusElementId === ""){
		return;
	}
	changeSquareValue(e.keyCode);
}

function doMouseDown(event){
	var canvasId = event.currentTarget.id;
	currentFocusElementIValue = canvasId[canvasId.length - 1];
	currentFocusElementJValue = canvasId[canvasId.length - 2];
	var canvasObject = document.getElementById(canvasId);
	if(canvasId !== currentFocusElementId && currentFocusElementId !== ""){
		var previousCanvasObject = document.getElementById(currentFocusElementId);
		previousCanvasObject.style.background = currentFocusElementBGColor;
	}
	currentFocusElementId = canvasId;
	currentFocusElementBGColor = canvasObject.style.background;
	canvasObject.style.background = "#FF0000";
}

function initalizeHTMLGrid(){
    for(j=0;j<9;j++){
        for(i=0; i<9; i++){
            var c=document.createElement("canvas");
            c.setAttribute('id','newcanvas'+(j+1)+(i+1));
            c.setAttribute('width',30);
            c.setAttribute('height',30);
            c.className=i;
	    c.addEventListener("mousedown", doMouseDown, false);
            document.getElementById("box"+j).appendChild(c);
            var ctx=c.getContext('2d');								//Get the context - needed for HTML5 manipulation
            ctx.fillStyle='#FFFFFF';								//Make it blank to begin with
            ctx.fillRect(0,0,28,28);							//Shape it
        }
    }
}

//function fills the global arrays of grid, gridRows and gridColumns
function calculateGrid(){
	var rerun=false;
    grid=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
    valuesEditable=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
    gridRows=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
    gridColumns=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
    sets=[generateNumbers(), generateNumbers(), generateNumbers(),generateNumbers(), generateNumbers(), generateNumbers(),generateNumbers(), generateNumbers(), generateNumbers()];
    var counter=0;
    var currentSquare=1;
    for(i=0; i<9; i++){//current row=i
        var currentLength=9;
        //var currentSet=generateNumbers();
        for(j=0; j<9; j++){//column=j, square=floor(j/3)+1+floor(i/3)*3
            //check if there is a conflict in a square, row or column
            var index=Math.floor(Math.random()*9);
            currentSquare=Math.floor(i/3)*3+1+Math.floor(j/3);
            var currentSet=sets[currentSquare-1];
            while(currentSet[index]==0||checkConflictSquare(currentSquare,currentSet[index])||checkConflictRow(i,currentSet[index])||checkCurrentColumn(j,currentSet[index])){
                currentSet[index]=0;//remove number from list
                if(currentSet[index]==0){
                    currentLength--;
                }
                if(currentLength==0){//out of numbers for this square->replenish and go back to last square
                    prevI=i;
                    resetRow(i);
                    i=prevI;
                    currentSquare=1+Math.floor(i/3)*3;
                    currentLength=9;
                    j=0;
                    currentSet=sets[currentSquare-1];
                    counter++;
                    continue;
                }
                else{//get new random index
                    index=Math.floor(Math.random()*9);
                }
                //rerun calculation if have tried for a long time
                if(counter>500000)
                {
                    console.log("Rerunning calculation");
                    rerun=true;
					break;
                }
            }
			if(!rerun){
				var currentNum=currentSet[index];
				if(currentNum==0){
					j--;
					continue;
				}
				currentSet[index]=0;
				var squareIndexCol=j%3;
				var squareIndexRow=i%3;
				grid[currentSquare-1][squareIndexRow*3+squareIndexCol]=currentNum;
				valuesEditable[currentSquare-1][squareIndexRow*3+squareIndexCol]=false;
				gridRows[i][j]=currentNum;
				gridColumns[j][i]=currentNum;
			}
			else
			{
				break;
			}
        }
		if(rerun){
			break;
		}
    }
	if(rerun){
		calculateGrid();
	}	
}

function styleGridElements(){
    for(j=0; j<9; j++){
        for(i=0;i<9;i++){
            var currentSquare=grid[j];
            var currentElement=currentSquare[i];
            var c=document.getElementById("newcanvas"+(j+1)+(i+1));
            var ntx=c.getContext('2d');
            ntx.fillStyle='#FFFFFF';
            ntx.fillRect(0,0,28,28);
            ntx.fillStyle='#000000';
            ntx.font = "20px Arial";
            //Removed elements are store as 0s in the arrays. Do not write the 0s the screen.
            c.style.background = "#FFA500";
            if( currentElement != 0 ){
		c.style.background = "#000000";
                ntx.fillText(currentElement,8,22);
            }
            ntx.fillStyle='#FFFFFF';
        }
    }
}


function checkGameSuccess(){
	var currentSquare = 0;
	for(var i = 0; i < 9; i++){
		currentSquare=1+Math.floor(i/3)*3;
		for(var j = 0; j < 9; j++){
			currentSquare = 1 + Math.floor(j/3) + (Math.floor(i/3) * 3);
			currentSquareIndex = (j % 3) + (3 * (i % 3))
			var squareIndexCol=j%3;
			var squareIndexRow=i%3;
			if(checkRow(i, gridRows[i][j], j) && checkColumn(j, gridRows[i][j], i) 
				&& checkSquare(currentSquare ,gridRows[i][j], currentSquareIndex)){
				continue;
			}else{
				alert("LOSER");
				return;
			}
		}
	}
	alert("WINNER");
}

//check if there is a conflict in a 9x9 square not including a certain index
function checkSquare(currentSquare, currentSelectedNumber, indexOfValue){
    var afterIndex = grid[currentSquare-1].indexOf(currentSelectedNumber, indexOfValue + 1);
    var beforeIndex = grid[currentSquare-1].indexOf(currentSelectedNumber);
    if(beforeIndex > -1 && beforeIndex < indexOfValue){
	return false;
    }else if(beforeIndex === indexOfValue){
	if(afterIndex > -1){
		return false;
	}else{
		return true;
	}
    }
    return true;
}

//check if there is a conflict in a row
function checkRow(currentRow,currentSelectedNumber, indexOfValue){
    var afterIndex = gridRows[currentRow].indexOf(currentSelectedNumber, indexOfValue + 1);
    var beforeIndex = gridRows[currentRow].indexOf(currentSelectedNumber);
    if(beforeIndex > -1 && beforeIndex < indexOfValue){
	return false;
    }else if(beforeIndex === indexOfValue){
	if(afterIndex > -1){
		return false;
	}else{
		return true;
	}
    }
    return true;
}

//check if there is a conflict in a column
function checkColumn(currentColumn, currentSelectedNumber, indexOfValue){
    var afterIndex = gridColumns[currentColumn].indexOf(currentSelectedNumber, indexOfValue + 1);
    var beforeIndex = gridColumns[currentColumn].indexOf(currentSelectedNumber);
    if(beforeIndex > -1 && beforeIndex < indexOfValue){
	return false;
    }else if(beforeIndex === indexOfValue){
	if(afterIndex > -1){
		return false;
	}else{
		return true;
	}
    }
    return true;
}

//check if there is a conflict in a 9x9 square
function checkConflictSquare(currentSquare, currentSelectedNumber){
    return grid[currentSquare-1].indexOf(currentSelectedNumber) > -1;
}

//check if there is a conflict in a row
function checkConflictRow(currentRow,currentSelectedNumber){
    return gridRows[currentRow].indexOf(currentSelectedNumber) > -1;
}

//check if there is a conflict in a column
function checkCurrentColumn(currentColumn, currentSelectedNumber){
    return gridColumns[currentColumn].indexOf(currentSelectedNumber) > -1;
}

//resets a sudoku row to zeros and replenishes the possible numbers
//available to each square
function resetRow(row){
    var currentRow=gridRows[row];
    var prevNumbers=[new Array(), new Array(), new Array()];
    for(i=0;i<9;i++){
        var currentColumn=gridColumns[i];
        var currentSquareIndex=Math.floor(row/3)*3+1+Math.floor(i/3);
        var currentSquare=grid[currentSquareIndex-1];
        currentColumn[row]=0;
        gridColumns[i]=currentColumn;
        //When generating the game, the follow line occasionally generates the error:
        //  Uncaught TypeError: Cannot set property '0' of undefined
        currentRow[i]=0;
        var currentPrevNumbers=prevNumbers[Math.floor(i/3)];
        currentPrevNumbers[i%3]=currentSquare[(row%3)*3+i%3];
        prevNumbers[Math.floor(i/3)]=currentPrevNumbers;
        currentSquare[(row%3)*3+i%3]=0;
        grid[currentSquareIndex-1]=currentSquare;
    }
    for(i=0;i<3;i++)
    {
        ii=i;
        refillSetForSquareAtRow(row, i);
        i=ii;
    }
    gridRows[row]=currentRow;
}

//refills the available numbers for a square
function refillSetForSquareAtRow(currentRow, currentSquareInRow){
    var currentSquare=Math.floor(currentRow/3)*3+currentSquareInRow+1;
    var newSet=new Array();
    var subRow=currentRow%3;
    for(i=0;i<(9-subRow*3);i++){
        var currentRandom=Math.floor(Math.random()*9+1);
        while((grid[currentSquare-1].indexOf(currentRandom)>-1)||(newSet.indexOf(currentRandom)>-1)){
            currentRandom=Math.floor(Math.random()*9+1);
        }
        newSet[i]=currentRandom;		
    }
    for(i=newSet.length;i<9;i++)
    {
        newSet[i]=0;
    }
    sets[currentSquare-1]=newSet
}

//generates a set of 9 randoms numbers from 1-9;
function generateNumbers(){
    var set=new Array();
    for(i=0;i<9;i++){
        var number=Math.floor(Math.random()*9+1);
        while(set.indexOf(number)>-1){
            number=Math.floor(Math.random()*9+1);
        }
        set[i]=number;
    }
    return set;
}

//Remove the elements from the board.
//  Based on the difficulty variable.
function removeNumbers(){
    var remove = 0;
    if( difficulty == 0 ){
        remove = 20;
    }
    else if( difficulty == 1 ){
        remove = 35;
    }
    else if( difficulty == 2 ){
        remove = 50;
    }

    for(i=0; i<remove; i++ ){
        //randomly select and element and remove it
        //  Random number will be between 0-8
        var randomNumber1 = Math.floor(Math.random()*9);
        var randomNumber2 = Math.floor(Math.random()*9);
        if( grid[randomNumber1][randomNumber2] != 0 ){
            grid[randomNumber1][randomNumber2] = 0;
	    valuesEditable[randomNumber1][randomNumber2] = true;
        }
        else{
            i--;
        }
    }
}

function StopWatch(){
    var startTime = null;
    var stopTime = null;
    var running = false;

    this.start = function(){ 
        if (running == true)
            return;
        else if (startTime != null) 
            stopTime = null; 

        running = true;    
        startTime = getTime();
    }

    this.stop = function(){
        if (running == false)
            return;

        running = false;
        stopTime = getTime();
    }

    this.duration = function(){
        if(running == true)
            return;

        return stopTime - startTime;
    }
}

function getTime(){
    var day = new Date();
    return day.getTime();
}
