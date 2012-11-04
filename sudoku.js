//array to hold array of squares. each index is an array of 9x9 sudoku squares
var grid=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
//array to hold absolute row by column sudoku grid
var gridRows=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
//array to hold absolute column by row sudoku grid
var gridColumns=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
//array to hold sets of avaiable numbers for each square. sets[i] is the set of numbers avaiable to be added to
//each 9x9 sudoku square, whose number is i+1;
var sets=[generateNumbers(), generateNumbers(), generateNumbers(),generateNumbers(), generateNumbers(), generateNumbers(),generateNumbers(), generateNumbers(), generateNumbers()];

//Difficultly selected by user. 0=Easy, 1=Medium, 2=Hard
//  Set when user selects button, then used to reset the board
//  to the correct difficulty. Easy game by default.
var difficulty=0;

function setEasy(){
    //difficulty = 0;
    console.log("setEasy()");
}

function setMedium(){
    //difficulty = 1;
    console.log("setMedium()");
}

function setHard(){
    //difficulty = 2;
    console.log("setHard()");
}

function resetGame(){
    //todo
    console.log("reset button");
}

function setEventHandlers(){
    //Set buttons to call difficulty functions
    console.log("In setEventHandlers");
    document.getElementById("easyButton").addEventListener('click', setEasy, false);
    document.getElementById("mediumButton").addEventListener("click", setMedium, true);
    document.getElementById("hardButton").addEventListener("click", setHard, true);
    document.getElementById("resetButton").addEventListener("click", resetGame, true);
}

//adds html5 canvases, generates a grid, and displays it on the load of the window
window.onload = function(){
    console.log("onLoad()");

    setEventHandlers();
    //initalizeHTMLGrid();
    //calculateGrid();
    //styleGridElements();
}

function initalizeHTMLGrid(){
    for(j=0;j<9;j++){
        for(i=0; i<9; i++){
            var c=document.createElement("canvas");
            c.setAttribute('id','newcanvas'+(j+1)+(i+1));
            c.setAttribute('width',30);
            c.setAttribute('height',30);
            c.className=i;
            document.getElementById("box"+j).appendChild(c);
            var ctx=c.getContext('2d');								//Get the context - needed for HTML5 manipulation
            ctx.fillStyle='#FFFFFF';								//Make it blank to begin with
            ctx.fillRect(0,0,28,28);							//Shape it
        }
    }
}

//function fills the global arrays of grid, gridRows and gridColumns
function calculateGrid(){
    grid=[new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array()];
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
                    calculateGrid();
                }
            }
            var currentNum=currentSet[index];
            if(currentNum==0){
                j--;
                continue;
            }
            currentSet[index]=0;
            var squareIndexCol=j%3;
            var squareIndexRow=i%3;
            grid[currentSquare-1][squareIndexRow*3+squareIndexCol]=currentNum;
            gridRows[i][j]=currentNum;
            gridColumns[j][i]=currentNum;
        }
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
            ntx.fillText(currentElement,5,20);
            ntx.fillStyle='#FFFFFF';
        }
    }
}

//check if there is a conflict in a 9x9 square
function checkConflictSquare(currentSquare, currentSelectedNumber){
    return grid[currentSquare-1].indexOf(currentSelectedNumber)>-1;
}

//check if there is a conflict in a row
function checkConflictRow(currentRow,currentSelectedNumber){
    return gridRows[currentRow].indexOf(currentSelectedNumber)>-1;
}

//check if there is a conflict in a column
function checkCurrentColumn(currentColumn, currentSelectedNumber){
    return gridColumns[currentColumn].indexOf(currentSelectedNumber)>-1;
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

    //for( i=0, i<remove; i++ ){
        //randomly select and element and remove it
    //}
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
