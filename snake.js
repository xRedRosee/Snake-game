// document.body.innerHTML = '<canvas id="gameCanvas" width="400" height="400"></canvas> <canvas id="highscorefield" width: "200" height: "200" </canvas>'
var r= document.querySelector(':root');

const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');

const N_Rows=20;
const N_Cols=20;

snakeMatrix=new Array(N_Rows);
for(let i=0;i<N_Rows;i++){
    snakeMatrix[i]=new Array(N_Cols);
};
snakeMatrix[5][5]=0;
gameover=false;
snakeDx=1,snakeDy=0;
var maxSnakeLength= 8;

function gameProgress(){
    if(gameover){//The game is over nothing can be done any more!!
        console.log('WTF!!! I said END OF GAME!');
        return;
    };
    let headRow,headCol;
    for(let row=0; row< N_Rows; row++){
        let rowCells=snakeMatrix[row];
        for(let col=0; col< N_Cols; col++){
            if(rowCells[col]==0){//the head is here!
                headRow=row;
                headCol=col;
            };                
            if(rowCells[col]>=0){
                rowCells[col]++;
                if(rowCells[col]>=maxSnakeLength){
                    rowCells[col]=undefined;
                }
            };
        }
    };
    headCol=headCol+snakeDx;
    headRow=headRow+snakeDy;
    if( (headCol<0) || //too much on the left 
        (headRow<0) || //too much on top
        (headCol>=N_Cols) || //too much on the right
        (headRow>=N_Rows) || //too much bottom
        (snakeMatrix[headRow][headCol]>0)
    ){
        gameover=true;
        clearInterval(hInterval);
        gameOverAlert();
        deadSound();
    }else{
        if(snakeMatrix[headRow][headCol] == 'O'){
            maxSnakeLength *= 0.7;
            extraHighScore();
            fruitSound();
        }else if(snakeMatrix[headRow][headCol] == 'B'){
            gameover=true;
            clearInterval(hInterval);
            gameOverAlert();
            deadSound();
            return;
        }
        snakeMatrix[headRow][headCol]=0;
    };
    renderMatrix();
};


function playBackgroundMusic(){
        var gameSong = new Audio("gamemusicbackground.mp3");
        gameSong.volume = 0.4;
        gameSong.play();
}
playBackgroundMusic();

function fruitSound(){
    var fruitSound = new Audio("eatingsoundeffect.mp3");
    fruitSound.volume = 0.8;
    fruitSound.play();
}

function deadSound(){
    var deadSound = new Audio("deadsoundeffect.mp3");
    deadSound.volume = 0.8;
    deadSound.play();
}

function renderMatrix() {
    let snake_border = '#943939';
    let snake_col = '#EF3F3F';
    let head_col = '#A70000';
    let background_col ='#2ECC71 ';
    let background_border = '#58D68D';
    let olive_col = '#FFBF00';
    let bomb_col = '#000000';
    for(let row=0; row< N_Rows; row++){
        let y = row * 20 + 20;
        let rowCells=snakeMatrix[row]; 
        for(let col=0; col< N_Cols; col++){
            let x = col * 20 + 20;
            let cell=rowCells[col];
            if(isNaN(cell)){
                if(cell == 'O'){
                    ctx.fillStyle = olive_col;
                    ctx.fillRect(x, y, 20, 20);
                }else if(cell == 'B'){
                    ctx.fillStyle = bomb_col;
                    ctx.fillRect(x, y, 20, 20);
                }
                else { 
                    ctx.fillStyle = background_col;
                    ctx.fillRect(x, y, 20, 20);
                    ctx.strokeStyle = background_border;
                    ctx.strokeRect(x, y, 20, 20);
                }
            }else
            if(cell===0){
                ctx.fillStyle = head_col;
                ctx.fillRect(x, y, 20, 20);
                ctx.strokeStyle = snake_border;
                ctx.strokeRect(x, y, 20, 20);
            }else
            if(cell>0){
                ctx.fillStyle = snake_col;
                ctx.fillRect(x, y, 20, 20);
                ctx.strokeStyle = snake_border;
                ctx.strokeRect(x, y, 20, 20);
            };
        };
        // s+='\n';
    };
    // document.querySelector('.snakegame').innerText=s;
}

//   const snake_col = 'lightblue';
//   const snake_border = 'darkblue';


// hInterval=setInterval(function(){
//     maxSnakeLength+=0.2;
//     gameProgress();
//     maybePlaceOlive();
//     maybePlaceBomb();
// },200);
//200

var pausee = false;

sInterval = setInterval(function(){
    if(pausee == false){
    showHighScore();
    document.querySelector('#gameScore').innerText = "Score: " + highScore;
}
},1000);

hInterval=setInterval(function(){
if (pausee == false){
  maxSnakeLength+=0.2;
  gameProgress();
  maybePlaceOlive();
  maybePlaceBomb();
}
},200);

var resume = false;
const pauseButton = document.querySelector('.pausebtn').addEventListener('click', pause)
function pause(){
    if(resume == false){
        pausee = true;
        return resume = true;
    }else if(resume == true) {
        pausee = false;
        return resume = false;
    }
}

document.body.addEventListener('keydown',function(e){
    console.log(e);
    switch(e.key){
        case 'ArrowLeft':snakeDx=-1;snakeDy= 0;break;//left arrow
        case 'ArrowUp':snakeDx= 0;snakeDy=-1;break;//up arrow
        case 'ArrowRight':snakeDx= 1;snakeDy= 0;break;//right arrow
        case 'ArrowDown':snakeDx= 0;snakeDy= 1;break;//down arrow
    };
    gameProgress();
});

// p=0.05
function maybePlaceOlive(p=0.05){
    if(!gameover && (Math.random()<p)){
        let oliveRow = Math.random()*N_Rows|0
        let oliveCol = Math.random()*N_Cols|0;
        if(snakeMatrix[oliveRow][oliveCol] === undefined){
            snakeMatrix[oliveRow][oliveCol] = 'O';
            renderMatrix();
        }
    }
};

function maybePlaceBomb(p=0.02){
    if(!gameover && (Math.random()<p)){
        let bombRow = Math.random()*N_Rows|0
        let bombCol = Math.random()*N_Cols|0;
        if(snakeMatrix[bombRow][bombCol] === undefined){
            snakeMatrix[bombRow][bombCol] = 'B';
            renderMatrix();
        }
    }
};


function gameOverAlert(){
        r.style.setProperty('--modalvisibility', 'block');
        showScoreWhenGameOver();
}

const restartBtn = document.querySelector('.restartbtn').addEventListener('click', restart)
const restartButton = document.querySelector('.restartbutton').addEventListener('click', restart)
function restart(){
    r.style.setProperty('--modalvisibility', 'none');
    location.reload();
};

document.body.addEventListener('keydown',function(event){
    switch(event.key){
        case 'Enter':
        restart();
        break;
    };
});


// var gameScore = document.querySelector('#gameScore');
var highScore = 0;

function showHighScore(){
    highScore += 1;
    return highScore;
}

function extraHighScore(){
    highScore+= 2;
    return highScore;
}


function showScoreWhenGameOver(){
    clearInterval(sInterval);
    showHighScore();
    document.querySelector('.gameoverscore').innerText = "Your score: " + highScore;
}

// sInterval = setInterval(function(){
//     showHighScore();
//     document.querySelector('#gameScore').innerText = "Score: " + highScore;
// },1000);