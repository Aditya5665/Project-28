const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas,baseimage,playerimage;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var numberOfArrows = 10;
var score = 0;
var board1, board2;

function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);

  var options = {
    isStatic: true
  };

  playerBase = Bodies.rectangle(200, 350, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 50, 180, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    340,
    playerBase.position.y - 112,
    120,
    120
  );

  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
}

function draw() {
  background(backgroundImg );
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  Engine.update(engine);

  playerArcher.display();

  board1.display();
  board2.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      //with distance formula
      d1 = dist(playerArrows[i].body.position.x,playerArrows[i].body.position.y, board1.body.position.x,board1.body.position.y)
      if(d1<=100)
      {
        console.log("collision");
      }

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );

      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      );

      if (board1Collision.collided || board2Collision.collided) {
        score +=5;
        console.log("yes");
      }

      //[optional code to add trajectory of arrow]
      
      // var posX = playerArrows[i].body.position.x;
      // var posY = playerArrows[i].body.position.y;

      // if (posX > width || posY > height) {
      //   if (!playerArrows[i].isRemoved) {
      //     playerArrows[i].remove(i);
      //   } else {
      //     playerArrows[i].trajectory = [];
      //   }
      // }
    }
  }

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  // Arrow Count
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Arrows Left: " + numberOfArrows, 200, 100);

  // Score
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Score: " + score, 1200, 100);

  if (numberOfArrows == 0) {
    console.log("arrow bucket is empty")
    gameOver();
  }
}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 20, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function gameOver(){
  swal(
    {
      title: "Game Over",
      text: "Thanks for Playing",
      imageUrl:
      "data:image/jpeg;base64,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",
      imageSize: "150x150",
      confirmButtonText: "Play Again",
    }
    function(isConfirm) {
      if(isConfirm){
        location.reload();
      }
    }
  );
}