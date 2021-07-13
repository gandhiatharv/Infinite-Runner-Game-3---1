var ghost, door, doorimg, climber, climberimg, spookysound, tower;
var towerimg, ghostjumpingimg, ghoststandingimg, doorGroup, climberGroup;
var invisibleBlockGroup, invisibleblock, gameover, gameoverimg, reset;
var resetimg, losesound, rand200;
var collectSound;
var object;
var witch, pirate, otherghost, mummy, zombie, alien, scaryGroup;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var score = 0;

function preload() {
  doorimg = loadImage("door.png");
  climberimg = loadImage("climber.png");
  towerimg = loadImage("tower.png");
  ghostjumpingimg = loadImage("ghost-jumping.png");
  ghoststandingimg = loadImage("ghost-standing.png");
  witch = loadImage("witch.png");
  zombie = loadImage("zombie.png");
  pirate = loadImage("pirate.png");
  mummy = loadImage("mummy.png");
  otherghost = loadImage("ghost.png");
  alien = loadImage("alien.png");
  spookysound = loadSound("spooky.wav");
  gameoverimg = loadImage("gameover.png");
  resetimg = loadImage("reset.png");
  losesound = loadSound("lose.wav");
  collectSound = loadSound("collect.mp3");
}

function setup() {
  createCanvas(600, 600);
  
  tower = createSprite(300, 300);
  tower.addImage(towerimg);
  
    fill("white");
  strokeWeight(2);
  stroke("orange");
  text("Score: " + score, 50, 50);
  
  ghost = createSprite(300, 300, 10, 10);
  ghost.addImage(ghostjumpingimg);
  ghost.scale = 0.4;
    
  gameover = createSprite(300, 235);
  gameover.addImage(gameoverimg);
  gameover.scale = 0.8;
  reset = createSprite(300, 375);
  reset.addImage(resetimg);
  reset.scale = 1;
  
  ghost.setCollider("circle", 0 , 30, 140);
  
  doorGroup = createGroup();
  climberGroup = createGroup();
  invisibleBlockGroup = createGroup();
  scaryGroup = createGroup();
}

function draw() {
  background(0);
  
  tower.depth = 1;
  fill("white");
  strokeWeight(2);
  stroke("orange");
  text("Score: " + score, 50, 50);
  
  camera.position.x = ghost.x;
  camera.position.y = ghost.y;
  
  if (gamestate === PLAY) {
    gameover.visible = false;
    reset.visible = false;
    
    losesound.stop();
    spookysound.loop();

    tower.velocityY = 1;
    
    if (tower.y > 400) {
      tower.y = 300;
    }
    
    
    if (keyDown("space")) {
      ghost.velocityY = -12;
    }
    
    ghost.velocityY = ghost.velocityY + 0.8;
    
    if (keyDown("left")) {
      ghost.x = ghost.x-5;
    }
    
    if (keyDown("right")) {
      ghost.x = ghost.x+5;
    }
    
    spawndoors();
    
    if (climberGroup.isTouching(ghost)) {
      ghost.velocityY = 0;      
    }
    
if (scaryGroup.isTouching(ghost)){
  scaryGroup.destroyEach();
  collectSound.play();
  score = score + 1;
}
    
    if (invisibleBlockGroup.isTouching(ghost)||ghost.y > 600) {
      ghost.visible = false;
      spookysound.stop();
      losesound.play();
      gamestate = END;
    }
    
  } 
  drawSprites();
  
  if (gamestate === END) {
    tower.velocityY = 0;
    
    gameover.visible = true;
    reset.visible = true;
      
    doorGroup.destroyEach();
    climberGroup.destroyEach();
    invisibleBlockGroup.destroyEach();
    scaryGroup.destroyEach();
  
    
    if (mousePressedOver(reset)) {
      resetgame();
    }
  }
}

function resetgame() {
  gamestate = PLAY;
  ghost.visible = true;
  ghost.x = 300;
  ghost.y = 100;
}


function spawndoors() {
  if (frameCount % 240 === 0){
    door = createSprite(200, -50);
    door.addImage(doorimg);
    climber = createSprite(200, 10);
    climber.addImage(climberimg);
    invisibleblock = createSprite(200, 15);
    invisibleblock.width = climber.width;
    invisibleblock.height = 2;
    door.x = Math.round(random(120, 400));
    climber.x = door.x;
    invisibleblock.x = door.x;
    door.velocityY = 1;
    climber.velocityY = 1;
    invisibleblock.velocityY = 1;
    door.lifetime = 800;
    climber.lifetime = 800;
    invisibleblock.lifetime = 800;
    doorGroup.add(door);
    climberGroup.add(climber);
    invisibleBlockGroup.add(invisibleblock);
    ghost.depth = door.depth;
    ghost.depth = ghost.depth + 2;
    var rand2 = Math.round(random(1, 3));
    if(rand2 === 1){
          var obstacle = createSprite(Math.round(random(climber.x - 30, climber.x + 30)), climber.y-40);
    //obstacle.debug = true;
    obstacle.velocityY = door.velocityY;
      obstacle.depth = ghost.depth - 1;
    
    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch(rand) {
      case 1: obstacle.addImage(witch);
            obstacle.scale = 0.15;
              break;
      case 2: obstacle.addImage(otherghost);       
        obstacle.scale = 0.15;

              break;
      case 3: obstacle.addImage(mummy);
                    obstacle.scale = 0.075;

              break;
      case 4: obstacle.addImage(alien);
                    obstacle.scale = 0.1;

              break;
      case 5: obstacle.addImage(pirate);
                    obstacle.scale = 0.15;

              break;
      case 6: obstacle.addImage(zombie);
                    obstacle.scale = 0.03;

              break;
      default: break;
    }
    
        //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 800;
    //add each obstacle to the group
    scaryGroup.add(obstacle);
    }

  }
}