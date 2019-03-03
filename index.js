  // _______________________Variables_________________
  var fruitOnScreen = false;
  var gameLost = false;
  var direction = "right"; 
  var snake = [];
  var fruit = undefined;
  var ate = false; //if fruit was eaten
  let score = document.querySelector(".score");
  var w = screen.width;
  var h = screen.height;
  var ctx = document.getElementById('canvas').getContext("2d");
  var gamePaused = false;
  var playingGame; //itervalID
  var loseSound = new Audio("sounds/lose.wav");
  let eat = new Audio("sounds/eat.wav");
  let pik = new Audio("sounds/pik.wav");
  // ___________________________________
  const arrows = document.querySelectorAll(".fas");
  const upKey = document.getElementById("up");
  const downKey = document.getElementById("down");
  const leftKey = document.getElementById("left");
  const rightKey = document.getElementById("right");
  const pauseButton = document.getElementById("pause");
  const playButton = document.getElementById("play");
  // _______________________Variables_________________
  //crating starting snake
  for (let i = 3; i >= 0; i--) {
    snake.push({
      x: i,
      y: 5
    });
  }

  if (w <= 700) {
    // __________Changing layout_________________________
    document.getElementById("canvas").setAttribute("height", "400");
    document.getElementById("canvas").setAttribute("width", "300");
    document.getElementById("smallScreenScore").style.display = 'block';
    
    if(h<=570) {
      document.getElementById("canvas").setAttribute("height", "300");
      document.getElementById("canvas").setAttribute("width", "290");
    }
    //___________EventListeners Arrows_______________________
    for (let i = 0; i < 6; i++) {
      arrows[i].addEventListener("click", function () {
        pik.play();
      });
    }
    upKey.addEventListener("click", function () {
      if(direction !== "down"){
            direction = "up";
      }
    });
    downKey.addEventListener("click", function () {
      if(direction !== "up"){
      direction = "down";
      }
    });
    leftKey.addEventListener("click", function () {
      if(direction !== "right"){
          direction = "left";
      }
    });
    rightKey.addEventListener("click", function () {
      if(direction !== "left"){
        direction = "right";
      }
    });
    //___________Play/Pause_______________________
    pauseButton.addEventListener("click", function () {
      console.log("pauza");
      document.getElementById("pause").style.display = 'none';
      document.getElementById("play").style.display = 'block';
      gamePaused = true;
      console.log("gamePaused: " + gamePaused);
      clearInterval(playingGame)
    });
    playButton.addEventListener("click", function () {
      console.log("start");
      document.getElementById("pause").style.display = 'block';
      document.getElementById("play").style.display = 'none';
      gamePaused = false;
      console.log(gamePaused);
      playingGame = setInterval(playing, 160);
    });
    playingGame = setInterval(playing, 160);
    drawFruit();
  } else {
    // __________Changing layout_________________________
    document.getElementById("smallScreenScore").style.display = 'none';
    document.getElementById("bigScreenScore").style.display = 'block';
    // __________Changing layout_________________________
    // cvsW = canvas.width;
    // cvsH = canvas.height;
    drawFruit();
  }
  // ________________________FUNCTIONS_______________________________
  function playing() {
    //checking if snake hit wall
    hitWall();
    //checking if snake ate itself
    snakeCollisionWithTailCheck();
    if (gameLost === true) {
      gameLostFunction();
    }

    let currentHead = {
      x: snake[0].x,
      y: snake[0].y
    }
    if (direction === "up") {
      var nextHead = {
        x: currentHead.x,
        y: currentHead.y - 1
      }
    } else if (direction === "down") {
      var nextHead = {
        x: currentHead.x,
        y: currentHead.y + 1
      }
    } else if (direction === "right") {
      var nextHead = {
        x: currentHead.x + 1,
        y: currentHead.y + 0
      }
    } else if (direction === "left") {
      var nextHead = {
        x: currentHead.x - 1,
        y: currentHead.y + 0
      }
    }
    snake.unshift(nextHead);
    let tail = {
      x: snake[snake.length - 1].x,
      y: snake[snake.length - 1].y,
    }
    //chaning path behind snake back to color black
    ctx.fillStyle = "black";
    ctx.fillRect(tail.x * 10, tail.y * 10, 10, 10);
    // _____________________fruit_______________
    if (fruit.x === snake[0].x && fruit.y === snake[0].y) {
      ate = true;
    }
    if (ate === false) {
      snake.pop();
    }
    if (ate === true) {
      scoreChange();
      // eatSound();
      eat.play();
      drawFruit();
      ate = false;
    }
    // _____________________fruit_______________
    //drawing everything
    draw();
  }
  //______________________DRAWING________________
  function drawSnake(x, y) {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = 'black';
    ctx.fillRect(x * 10, y * 10, 10, 10);
    ctx.strokeRect(x * 10, y * 10, 10, 10);
  }

  function draw() {
    for (let i = 0; i < snake.length; i++) {
      let x = snake[i].x;
      let y = snake[i].y;
      drawSnake(x, y);
    }
  }

  function drawFruit() {
    let randomX = (Math.floor((Math.random() * ((canvas.width / 10) - 1)))) * 10;
    let randomY = (Math.floor((Math.random() * ((canvas.height / 10) - 1)))) * 10;
    fruit = {
      x: randomX / 10,
      y: randomY / 10
    };
    ctx.fillStyle = "red";
    ctx.fillRect(randomX, randomY, 10, 10);
  }

  function scoreChange() {
    score.innerHTML = Number(score.innerHTML) + 1;
    if (gameLost === true) {
      score.innerHTML = "0";
    }
  }
  //______________________DRAWING________________

  function gameLostFunction() {
    //red screen flash on lose
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //going back to black screen and drawing new fruit
    setTimeout(function () {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawFruit();}, 80);
    //restarting game
    snake = [];
    for (let i = 3; i >= 0; i--) {
      snake.push({
        x: i,
        y: 5
      });
    }
    scoreChange();
    gameLost = false;
    direction = "right";
  }

  function hitWall() {
    if (snake[0].x === (canvas.width / 10) || snake[0].x === -1) {
      gameLost = true;
      loseSound.play();
    } else if (snake[0].y === (canvas.height / 10) || snake[0].y === -1) {
      gameLost = true;
      loseSound.play();
    }
  }

  function snakeCollisionWithTailCheck() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        gameLost = true;
        loseSound.play();
      }
    }
  }
