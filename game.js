const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')



let  canvasSize;
let  elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosicion = {
    x: undefined,
    y: undefined,
};

const giftPosicion = {
    x: undefined,
    y: undefined,
};
let enemiesPositions = [];

window.addEventListener('load', setCanvasSize,);
window.addEventListener('resize', setCanvasSize,);

    function setCanvasSize() {
        if (window.innerHeight > window.innerWidth) {
            canvasSize = window.innerWidth * 0.8;
        } else {
            canvasSize = window.innerHeight * 0.8;
        }

        canvas.setAttribute("width", canvasSize);
        canvas.setAttribute("height", canvasSize);
        
        elementSize = (canvasSize / 10) - 1;

        startGame();
    }

    function startGame() {
        console.log({ canvasSize, elementSize });
        
        game.font = elementSize + 'px Verdana';
        game.textAlign = '';
        
        const map = maps[level];  
        if (!map) {
            gameWin();
            return;
        } 

        if (!timeStart) {
            timeStart = Date.now();
            timeInterval = setInterval(showTime, 100);
            showRecord();
        }

        const mapRows = map.trim().split('\n');
        const mapRowsCols = mapRows.map(row => row.trim().split(''));
        console.log({mapRowsCols, map, mapRows});

        showLives();

        enemiesPositions = [];

        game.clearRect(0, 0, canvasSize, canvasSize);
        mapRowsCols.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                const emoji = emojis[col];
                const posX = elementSize * (colI - 0.1);
                const  posY = elementSize * (rowI + 1);
                game.fillText(emoji, posX, posY);

                if (col == 'O') {
                    if (!playerPosicion.x && !playerPosicion.y) {
                        playerPosicion.x =  posX;
                        playerPosicion.y = posY;
                        console.log({playerPosicion});
                    }
                } else if (col == 'I') {
                    giftPosicion.x = posX;
                    giftPosicion.y = posY;
                } else if (col == 'X') {
                    enemiesPositions.push({
                        x: posX,
                        y: posY,
                    });
                }    
            });
        });
        movePlayer();
    }

    function movePlayer() {
        const giftColisionX = playerPosicion.x.toFixed(3) == giftPosicion.x.toFixed(3);
        const giftColisionY = playerPosicion.y.toFixed(3) == giftPosicion.y.toFixed(3);
        const giftColision = giftColisionX &&  giftColisionY;

        if (giftColision) {
          levelWin();
        }

        const enemiesColision = enemiesPositions.find(enemy => {
            const enemyColisionX = enemy.x.toFixed(3) == playerPosicion.x.toFixed(3)
            const enemyColisiony =enemy.y.toFixed(3) == playerPosicion.y.toFixed(3)
            return enemyColisionX && enemyColisiony;
        });

        if (enemiesColision) {
            levelFail();
            console.log('Chocaste contra un enemigo');
        }

        game.fillText(emojis['PLAYER'], playerPosicion.x, playerPosicion.y);
    }

    function levelWin() {
        console.log('Subiste de nivel');
        level++;
        startGame();
    }

    function levelFail() { 
        console.log('Chocaste contra un enemigo');
        lives--;

        if (lives <= 0) {
            level = 0;
            lives = 3;
            timeStart = undefined;
        }

        playerPosicion.x = 0;
        playerPosicion.y = 0;
        startGame();
    }

    function gameWin() {
        console.log('Terminaste el juego');
        clearInterval(timeInterval);
        
        const recordTime = localStorage.getItem('record_time');
        const playerTime = Date.now() - timeStart;

        if (recordTime) {
            if (recordTime >= playerTime){
                localStorage.setItem('record_time', playerTime);
                pResult.innerHTML ='Felicidades superaste el RECORD :D';
            } else {
                pResult.innerHTML ='Lo siento, no superaste el record :(';
            }
        } else {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML ='Primera vez? Trata de superar tu tiempo :)';
        }

        console.log({recordTime, playerTime});
    }

    function showLives() {
        const heartArray = Array(lives).fill(emojis['HEART']) // [1,2,3]
        // console.log(heartArray);
    
        spanLives.innerHTML = "";
        heartArray.forEach(heart => spanLives.append (heart));
        // spanLives.innerHTML = emojis['HEART'];
    }

    function showTime () {
        spanTime.innerHTML = Date.now() - timeStart;
    }

    function showRecord () {
        spanRecord.innerHTML = localStorage.getItem('record_time');
    }

    window.addEventListener('keydown', moveByKeys);
    btnUp.addEventListener('click', moveUp);
    btnLeft.addEventListener('click', moveLeft);
    btnRight.addEventListener('click', moveRight);
    btnDown.addEventListener('click', moveDown);

    function moveByKeys(event) {
        if (event.key == 'ArrowUp') moveUp();
        else if (event.key == 'ArrowLeft') moveLeft();
        else if (event.key == 'ArrowRight') moveRight();
        else if (event.key == 'ArrowDown') moveDown();
      }
      
    function moveUp() {
        console.log('Me quiero mover hacia arriba');

        if (playerPosicion.y < elementSize) {
            console.log('OUT');
        } else {
            playerPosicion.y -= elementSize;
            startGame();
        }
    }

    function moveLeft() {
        console.log('Me quiero mover hacia a la izquierda');

        if ((playerPosicion.x  - elementSize) <elementSize -(elementSize * 2)) {
            console.log('OUT');
        } else {
            playerPosicion.x -= elementSize;
            startGame();
        }
    }

    function moveRight() {
        console.log('Me quiero mover hacia a la derecha');

        if ((playerPosicion.x  + elementSize ) > canvasSize - elementSize) {
            console.log('OUT');
        } else {
            playerPosicion.x += elementSize;
            startGame();
        }
    }

    function moveDown() {
        console.log('Me quiero mover hacia abajo');
        if (playerPosicion.y > elementSize * 9) {
            console.log('OUT');
        } else {
            playerPosicion.y += elementSize;
            startGame();
        }
    }