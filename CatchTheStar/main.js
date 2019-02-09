var ctx = document.getElementById("ctx").getContext("2d");
var catcherOne = new Image();
var catcherTwo = new Image();
var catcherThree = new Image();
var catcherFour = new Image();
var background = new Image();
var blood = new Image();
var tile = new Image();
var food = new Image();

var score = 0;
var level = 100;
var animation = 0;
var foodTimer = 0;
var gameover = false;
var intervalVar;
var foodList = [];
var tileList = [];
var foodDrop = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

var tileObject = {
  height: 20,
  width: 50
};

var catcher = {
  x: 100,
  y: 350,
  width: 30,
  height: 50,
  jump: 0,
  onair: false,
  jumpUnit: 5,
  spd: 0,
  leftPressed: false,
  rightPressed: false,
  gravity: 10,
  safe: true
};

var foodObject = {
  height: 50,
  width: 50,
  spd: 3
};

background.onload = function() {
  blood.onload = function() {
    catcherOne.onload = function() {
      catcherTwo.onload = function() {
        catcherThree.onload = function() {
          catcherFour.onload = function() {
            food.onload = function() {
              tile.onload = function() {
                drawObject = function(object, x, y, width, height) {
                  ctx.drawImage(object, x, y, width, height);
                };

                document.onkeydown = function(event) {
                  if (event.keyCode == 37 && catcher.x > 0) {
                    catcher.spd = -5;
                    catcher.leftPressed = true;
                  }
                  if (event.keyCode == 39 && catcher.x < 500 - catcher.width) {
                    catcher.spd = 5;
                    catcher.rightPressed = true;
                  }
                  if (
                    event.keyCode == 38 &&
                    !catcher.onair &&
                    catcher.y == 350
                  ) {
                    if (!catcher.onair) {
                      catcher.jump = 100;
                      catcher.onair = true;
                    }
                  }
                };

                document.onkeyup = function(event) {
                  if (event.keyCode == 37) {
                    catcher.leftPressed = false;
                  }
                  if (event.keyCode == 39) {
                    catcher.rightPressed = false;
                  }
                };

                food_catcher_collision = function(f) {
                  return (
                    f.x < catcher.x + catcher.width &&
                    catcher.x < f.x + foodObject.width &&
                    f.y < catcher.y + catcher.height &&
                    catcher.y < f.y + foodObject.height
                  );
                };

                food_tile_collision = function(f, t) {
                  return (
                    f.x < t.x + tileObject.width &&
                    t.x < f.x + foodObject.width &&
                    f.y < t.y + tileObject.height &&
                    t.y < f.y + foodObject.height
                  );
                };

                catcher_tile_collision = function(t) {
                  return (
                    catcher.x <= t.x + tileObject.width &&
                    t.x <= catcher.x + catcher.width &&
                    catcher.y + catcher.height <= t.y
                  );
                };

                jump = function() {
                  // Moving up
                  if (catcher.jump > 0 && catcher.onair) {
                    catcher.y -= catcher.jumpUnit;
                    catcher.jump -= catcher.jumpUnit;
                  }
                  if (
                    catcher.jump <= 0 &&
                    catcher.jump > -100 &&
                    catcher.onair
                  ) {
                    catcher.y += catcher.jumpUnit;
                    catcher.jump -= catcher.jumpUnit;
                  }
                  if (catcher.jump <= -100 && catcher.onair) {
                    catcher.onair = false;
                  }
                };

                updateFoodPosition = function() {
                  for (var i in foodList) {
                    if (foodList[i].y > 500) {
                      foodList.splice(i, 1);
                    } else {
                      foodList[i].y += foodObject.spd;
                    }
                  }
                };

                updateCatcherPosition = function() {
                  if (catcher.leftPressed && catcher.x > 0) {
                    catcher.x += catcher.spd;
                  }
                  if (catcher.rightPressed && catcher.x < 500 - catcher.width) {
                    catcher.x += catcher.spd;
                  }
                };

                updatePosition = function() {
                  ctx.clearRect(0, 0, 500, 500);
                  ctx.drawImage(background, 0, 0, 500, 500);
                  foodTimer++;
                  if (foodTimer > 100) {
                    foodList.push({
                      x: foodDrop[Math.round(Math.random() * 9)],
                      y: 0
                    });
                    foodTimer = 0;
                  }

                  if (catcher.onair) {
                    drawObject(
                      catcherFour,
                      catcher.x,
                      catcher.y,
                      catcher.width,
                      catcher.height
                    );
                  } else if (animation == 0) {
                    drawObject(
                      catcherOne,
                      catcher.x,
                      catcher.y,
                      catcher.width,
                      catcher.height
                    );
                    animation = 1;
                  } else if (animation == 1) {
                    drawObject(
                      catcherTwo,
                      catcher.x,
                      catcher.y,
                      catcher.width,
                      catcher.height
                    );
                    animation = 0;
                  }

                  for (var i in foodList) {
                    drawObject(
                      food,
                      foodList[i].x,
                      foodList[i].y,
                      foodObject.width,
                      foodObject.height
                    );
                  }

                  for (var i = 0; i < tileList.length; i++) {
                    drawObject(
                      tile,
                      tileList[i].x,
                      tileList[i].y,
                      tileObject.width,
                      tileObject.height
                    );
                  }

                  for (var i in foodList) {
                    if (food_catcher_collision(foodList[i])) {
                      score++;
                      foodList.splice(i, 1);
                    }
                  }
                  for (var i in foodList) {
                    for (var j in tileList) {
                      if (food_tile_collision(foodList[i], tileList[j])) {
                        tileList.splice(j, 1);
                      }
                    }
                  }

                  updateFoodPosition();
                  updateCatcherPosition();
                  jump();
                };

                startGame = function() {
                  score = 0;
                  level = 100;
                  catcher.y = 350;
                  catcher.x = 100;
                  catcher.onair = false;
                  catcher.leftPressed = false;
                  catcher.rightPressed = false;
                  catcher.safe = true;
                  animation = 0;
                  foodTimer = 0;
                  gameover = false;
                  tileList = [];
                  foodList = [];

                  for (var i = 0; i <= 9; i++) {
                    tileList.push({ x: i * 50, y: 400 });
                  }

                  intervalVar = setInterval(updatePosition, 10); // 100 fps game
                };

                startGame();
              };
              tile.src = "images/tile.png";
            };
            food.src = "images/food.png";
          };
          catcherFour.src = "images/catcher4.png";
        };
        catcherThree.src = "images/catcher3.png";
      };
      catcherTwo.src = "images/catcher2.png";
    };
    catcherOne.src = "images/catcher1.png";
  };
  blood.src = "images/blood.png";
};
background.src = "images/background.jpg";
