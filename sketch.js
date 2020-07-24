let mousePosX, mousePosY = 10;
let mouseOnGame = false;
let turn = 0;// 0 = white | 1 = black
let cellGrid = [];
let lastX, lastY;
let moveChoices = 0;
let totalWhite = 2;
let totalBlack = 2;
let addedWhite = 0;
let addedBlack = 0;
let gameOver = false;
let previewing;
let font;
let bouncingY = 325;
let time = 0;

function setup() {

  let cnv = createCanvas(400, 450);
  //cnv.position(50, 50);
  frameRate(30);
  noLoop();

  //font = loadFont("assets/Trebuchet MS.ttf");

  //cellgrid initialization
  for (let i = 0; i < 8; i++) {

    cellGrid[i] = [];
    for (let j = 0; j < 8; j++) {

      cellGrid[i][j] = new cell(i, j);
      print("New cell at " + i + " : " + j);
    }
  }
  cellGrid[3][4].val = 2;
  cellGrid[4][3].val = 2;
  cellGrid[3][3].val = 1;
  cellGrid[4][4].val = 1;

  mousePosX = 10;
  mousePosY = 10;

  moveChoices = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {

      cellGrid[i][j].updateValidity();
    }
  }

  redraw();
}

function draw() {//---------------------------------------------------------------------------

  background(66, 135, 245);

  if (gameOver) {

    loop();
  }

  time += 2;
  bouncingY = floor((sin(time / 10) * 25) + 350);

  for (let i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      cellGrid[i][j].displayVal = 0;
    }
  }

  //checking mouse position
  mousePosX = floor(mouseX / 50);
  mousePosY = floor(mouseY / 50);
  if (mousePosX > 7 || mousePosY > 7 || mousePosX < 0 || mousePosY < 0) {

    mouseOnGame = false;
  } else {

    mouseOnGame = true;
  }

  if (mouseOnGame && !gameOver && cellGrid[mousePosX][mousePosY].validMove) {

    previewing = true;
  } else {

    previewing = false;
  }

  lastX = mousePosX;
  lastY = mousePosY;

  if (previewing) {

    addedBlack = 0;
    addedWhite = 0;
    if (turn == 0) {

      addedWhite++;
    } else {

      addedBlack++;
    }

    if (turn == 0) {
      cellGrid[mousePosX][mousePosY].preview();
    }
  } else {

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        cellGrid[i][j].displayVal = 0;
      }
    }
  }

  if (moveChoices == 0) {
    turn = switchInt(turn);

    moveChoices = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        cellGrid[i][j].updateValidity();
      }
    }
    print("No moves - switching turns");
  }

  if (totalBlack + totalWhite == 64) {

    print("Game over");
    gameOver = true;
    loop();
    redraw();
  }

  if (turn == 1 && !gameOver) {// A.I. Magic!!! ---------------------------------------------------

    let possibleMoves = [];
    let possibleScores = [];
    let highestScore = 0;
    let bestMoves = [];
    let choiceIndex;

    print("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAI: Its my turn!");

    for (let i = 0; i < 8; i++) {//getting all possibleMoves
      for (let j = 0; j < 8; j++) {

        if (cellGrid[i][j].validMove) {

          possibleMoves.push(cellGrid[i][j]);
        }
      }
    }

    possibleScores.length = possibleMoves.length;
    print("AI: I got " + possibleMoves.length + " possible moves. Evaluating...");
    highestScore = 0;

    for (let i = 0; i < possibleMoves.length; i++) {

      addedBlack = 0;
      addedWhite = 0;
      possibleMoves[i].preview();
      possibleScores[i] = addedBlack;
      print("AI: Move #" + i + " scored " + possibleScores[i]);

      if (possibleScores[i] > highestScore) {

        highestScore = possibleScores[i];
      }
    }

    print("AI: Done evaluating and my best move gives me a score of " + highestScore + ". Comparing...");

    for (let i = 0; i < possibleMoves.length; i++) {

      if (possibleScores[i] == highestScore) {

        bestMoves.push(possibleMoves[i]);
      }
    }

    print("AI: I found " + bestMoves.length + " moves that get me " + highestScore + ". Choosing one...");

    choiceIndex = floor(random(bestMoves.length));

    print("AI: I've decided on " + bestMoves[choiceIndex].x + " : " + bestMoves[choiceIndex].y + " \nAI: Now it's your turn!");

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        cellGrid[i][j].displayVal = 0;
      }
    }

    /*cellGrid[bestMoves[choiceIndex].x][bestMoves[choiceIndex].y].finalizeChoice();
    cellGrid[bestMoves[choiceIndex].x][bestMoves[choiceIndex].y].val = 2;
    turn = switchInt(turn);
    redraw();*/
    go(bestMoves[choiceIndex].x, bestMoves[choiceIndex].y);
  }

  //cell grid commands
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {

      //drawing checker board pattern
      noStroke();
      fill(80, 150, 255);
      if (i % 2 == 0) {

        if (j % 2 == 0) {

          rect(i * 50, j * 50, 50, 50);
        }
      } else {

        if (j % 2 != 0) {

          rect(i * 50, j * 50, 50, 50);
        }
      }

      cellGrid[i][j].display();
    }
  }

  //drawing cursor
  if (mouseOnGame && !gameOver) {

    noFill();
    strokeWeight(5);
    if (turn == 0) {

      stroke(240);
      rect(mousePosX * 50, mousePosY * 50, 50, 50);

    } else if (turn == 1) {

      stroke(15);
      rect(mousePosX * 50, mousePosY * 50, 50, 50);
    } else {

      print("ERROR: invalid turn ID");
    }
  }

  //under bar thingy
  fill(240);
  noStroke();
  rect(0, 400, 400, 50);

  fill(150);
  if (turn == 0 && !gameOver) {

    strokeWeight(5);
    stroke(60, 130, 255);
    rect(5, 405, 80, 40, 15);
    noStroke();
    rect(315, 405, 80, 40, 15);
  } else if (turn == 1 && !gameOver) {

    strokeWeight(5);
    stroke(80, 150, 255);
    rect(315, 405, 80, 40, 15);
    noStroke();
    rect(5, 405, 80, 40, 15);
  } else if (gameOver) {

    noStroke();
    rect(315, 405, 80, 40, 15);
    rect(5, 405, 80, 40, 15);
  }

  strokeWeight(3)
  fill(245);
  stroke(225);
  ellipse(24.5, 425, 25, 25);//scoreboard pieces
  fill(40);
  stroke(0);
  ellipse(375.5, 425, 25, 25);;//scoreboard pieces

  fill(30);//    scores
  noStroke();
  textSize(30);
  textAlign(LEFT, CENTER);
  text(totalWhite, 45, 426);
  textAlign(RIGHT, CENTER);
  text(totalBlack, 355, 426);

  if (turn == 0) {

    if (addedWhite >= 0 && previewing) {

      fill(0, 230, 0);
      textAlign(LEFT, CENTER);
      text("+" + addedWhite, 90, 426);
    } else if (addedWhite < 0 && previewing) {

      fill(230, 0, 0);
      textAlign(LEFT, CENTER);
      text(addedWhite, 90, 426);
    }

    if (addedBlack >= 0 && previewing) {

      fill(0, 230, 0);
      textAlign(RIGHT, CENTER);
      text("+" + addedBlack, 310, 426);
    } else if (addedBlack < 0 && previewing) {

      fill(230, 0, 0);
      textAlign(RIGHT, CENTER);
      text(addedBlack, 310, 426);
    }
  }

  if (gameOver) {

    if (totalBlack < totalWhite) {

      fill(245);
      stroke(225);
      rect(12, bouncingY - 20, 120, 35, 15);

      textSize(30);
      textAlign(LEFT, CENTER);
      fill(10);
      noStroke();
      text("Winner!", 20, bouncingY);

      noFill();
      strokeWeight(6);
      stroke(60, 130, 255);
      rect(5, 405, 80, 40, 15);
    } else if (totalBlack > totalWhite) {

      fill(245);
      stroke(225);
      rect(270, bouncingY - 20, 120, 35, 15);

      textSize(30);
      textAlign(RIGHT, CENTER);
      fill(10);
      noStroke();
      text("Winner!", 380, bouncingY);

      noFill();
      strokeWeight(6);
      stroke(60, 130, 255);
      rect(315, 405, 80, 40, 15);
    } else {

      fill(245);
      stroke(225);
      rect(160, bouncingY - 20, 80, 35, 15);

      textSize(30);
      textAlign(CENTER, CENTER);
      fill(10);
      noStroke();
      text("Tie!", 200, bouncingY);
    }
  }

  noStroke();
  fill(200);
  rect(140, 404, 120, 43, 15);

  textAlign(CENTER, CENTER);
  textSize (25);
  fill(10);
  text("Reversi", 200, 418);
  textSize (15);
  text("by Jaxson", 200, 437);

  //     debugging
  fill(0);
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  //text(previewing, 2, 2);
}

class cell {
  constructor(x, y) {//------------------------------------------------------------

    this.x = x;
    this.y = y;
    this.val = 0;//0 = blank | 1 = white | 2 = black
    this.displayVal = 0;
    this.validMove = false;

    this.n = false;
    this.ne = false;
    this.e = false;
    this.se = false;
    this.s = false;
    this.sw = false;
    this.w = false;
    this.nw = false;
  }

  display() {

    if (this.validMove) {

      noStroke();
      fill(255, 0, 0, 50);
      rect(this.x * 50, this.y * 50, 50, 50);
    }
    if (this.displayVal == 0) {

      strokeWeight(5);
      if (this.val == 1) {

        fill(245);
        stroke(225);
        ellipse(this.x * 50 + 25, this.y * 50 + 25, 40, 40);
      } else if (this.val == 2) {

        fill(40);
        stroke(0);
        ellipse(this.x * 50 + 25, this.y * 50 + 25, 40, 40);
      }
    } else if (this.displayVal == 1) {

      strokeWeight(5);
      fill(245);
      stroke(225);
      ellipse(this.x * 50 + 25, this.y * 50 + 25, 40, 40);
    } else if (this.displayVal == 2) {

      strokeWeight(5);
      fill(40);
      stroke(0);
      ellipse(this.x * 50 + 25, this.y * 50 + 25, 40, 40);
    }

    textSize(20);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    //text(this.nw, (this.x * 50) + 25, (this.y * 50) + 25);
  }

  updateValidity() {//---------------------------------------------------------------------------

    this.n = false;
    this.ne = false;
    this.e = false;
    this.se = false;
    this.s = false;
    this.sw = false;
    this.w = false;
    this.nw = false;

    let opVal = 1 + switchInt(turn);
    let sameVal = 1 + turn;

    if (this.val == 0) {// checking north

      let toEvalN = [];
      for (let i = 1; i < 8; i++) {


        if (this.y - i >= 0 && cellGrid[this.x][this.y - i] != undefined) {

          toEvalN.push(cellGrid[this.x][this.y - i]);
        }
      }
      for (let j = 0; j < toEvalN.length; j++) {

        if (toEvalN[j].val == 0) {// evaluating

          break;
        } else if (toEvalN[j].val == sameVal) {

          if (j > 0) {
            this.n = true;
          }
          break;
        }
      }
    }

    if (this.val == 0) {// checking north east

      let toEvalNE = [];
      for (let i = 1; i < 8; i++) {

        if (this.y - i >= 0 && this.x + i <= 6 && cellGrid[this.x + i][this.y - i] != undefined) {

          toEvalNE.push(cellGrid[this.x + i][this.y - i]);
        }
      }
      for (let j = 0; j < toEvalNE.length; j++) {

        if (toEvalNE[j].val == 0) {// evaluating

          break;
        } else if (toEvalNE[j].val == sameVal) {

          if (j > 0) {
            this.ne = true;
          }
          break;
        }
      }
    }

    if (this.val == 0) {// checking east

      let toEvalE = [];
      for (let i = 1; i < 8; i++) {


        if (this.x + i < 8 && cellGrid[this.x + i][this.y] != undefined) {

          toEvalE.push(cellGrid[this.x + i][this.y]);
        }
      }
      for (let j = 0; j < toEvalE.length; j++) {

        if (toEvalE[j].val == 0) {// evaluating

          break;
        } else if (toEvalE[j].val == sameVal) {

          if (j > 0) {
            this.e = true;
          }
          break;
        }
      }
    }

    if (this.val == 0) {// checking south east

      let toEvalSE = [];
      for (let i = 1; i < 8; i++) {

        if (this.y - i >= 0 && this.x - i >= 0 && cellGrid[this.x - i][this.y - i] != undefined) {

          toEvalSE.push(cellGrid[this.x - i][this.y - i]);
        }
      }
      for (let j = 0; j < toEvalSE.length; j++) {

        if (toEvalSE[j].val == 0) {// evaluating

          break;
        } else if (toEvalSE[j].val == sameVal) {

          if (j > 0) {
            this.nw = true;
          }
          break;
        }
      }
    }

    if (this.val == 0) {// checking south

      let toEvalS = [];
      for (let i = 1; i < 8; i++) {

        if (this.y - i < 6 && cellGrid[this.x][this.y + i] != undefined) {

          toEvalS.push(cellGrid[this.x][this.y + i]);
        }
      }
      for (let j = 0; j < toEvalS.length; j++) {

        if (toEvalS[j].val == 0) {// evaluating

          break;
        } else if (toEvalS[j].val == sameVal) {

          if (j > 0) {
            this.s = true;
          }
          break;
        }
      }
    }

    if (this.val == 0) {// checking south west

      let toEvalSW = [];
      for (let i = 1; i < 8; i++) {

        if (this.y - i <= 7 && this.x - i >= 0 && cellGrid[this.x - i][this.y + i] != undefined) {

          toEvalSW.push(cellGrid[this.x - i][this.y + i]);
        }
      }
      for (let j = 0; j < toEvalSW.length; j++) {

        if (toEvalSW[j].val == 0) {// evaluating

          break;
        } else if (toEvalSW[j].val == sameVal) {

          if (j > 0) {
            this.sw = true;
          }
          break;
        }
      }
    }

    if (this.val == 0) {// checking west

      let toEvalW = [];
      for (let i = 1; i < 8; i++) {


        if (this.x - i >= 0 && cellGrid[this.x - i][this.y] != undefined) {

          toEvalW.push(cellGrid[this.x - i][this.y]);
        }
      }
      for (let j = 0; j < toEvalW.length; j++) {

        if (toEvalW[j].val == 0) {// evaluating

          break;
        } else if (toEvalW[j].val == sameVal) {

          if (j > 0) {
            this.w = true;
          }
          break;
        }
      }
    }

    if (this.val == 0) {// checking north west

      let toEvalNW = [];
      for (let i = 1; i < 8; i++) {

        if (this.y + i <= 7 && this.x + i <= 7 && cellGrid[this.x + i][this.y + i] != undefined) {

          toEvalNW.push(cellGrid[this.x + i][this.y + i]);
        }
      }
      for (let j = 0; j < toEvalNW.length; j++) {

        if (toEvalNW[j].val == 0) {// evaluating

          break;
        } else if (toEvalNW[j].val == sameVal) {

          if (j > 0) {
            this.se = true;
          }
          break;
        }
      }
    }

    if (!this.n && !this.ne && !this.e && !this.se && !this.s && !this.sw && !this.w && !this.nw) {//is it a valid move

      this.validMove = false;
    } else {

      this.validMove = true;
      moveChoices++;
    }
  }

  finalizeChoice() {//---------------------------------------------------------------------------

    let toSwitch = [];

    let distanceN = this.y;
    let distanceE = 7 - this.x;
    let distanceS = 7 - this.y;
    let distanceW = this.x;

    let distanceNE;
    if (distanceN > distanceE) {
      distanceNE = distanceE;
    } else {
      distanceNE = distanceN;
    }

    let distanceSW;
    if (distanceN > distanceW) {
      distanceSW = distanceW;
    } else {
      distanceSW = distanceN;
    }

    let sameVal = 1 + turn;

    if (this.n) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x][this.y - i] != undefined) {

          if (cellGrid[this.x][this.y - i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x][this.y - i]);
          }
        }
      }
    }

    if (this.ne) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x + i][this.y - i] != undefined) {

          if (cellGrid[this.x + i][this.y - i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x + i][this.y - i]);
          }
        }
      }
    }

    if (this.e) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x + i][this.y] != undefined) {

          if (cellGrid[this.x + i][this.y].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x + i][this.y]);
          }
        }
      }
    }

    if (this.se) {

      for (let i = 1; i < 8; i++) {

        if (this.x + i < 8 && this.y + i < 8) {

          if (cellGrid[this.x + i][this.y + i] != null) {

            if (cellGrid[this.x + i][this.y + i].val == sameVal || cellGrid[this.x + i][this.y + i].val == 0)  {

              break;
            } else {

              toSwitch.push(cellGrid[this.x + i][this.y + i]);
            }
          }
        }
      }
    }

    if (this.s) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x][this.y + i] != null) {

          if (cellGrid[this.x][this.y + i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x][this.y + i]);
          }
        }
      }
    }

    if (this.sw) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x - i][this.y + i] != null) {

          if (cellGrid[this.x - i][this.y + i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x - i][this.y + i]);
          }
        }
      }
    }

    if (this.w) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x - i][this.y] != null) {

          if (cellGrid[this.x - i][this.y].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x - i][this.y]);
          }
        }
      }
    }

    if (this.nw) {

      for (let i = 1; i < 8; i++) {

        if (this.x - i >= 0 && this.y - i >= 0) {
          if (cellGrid[this.x - i][this.y - i] != null) {

            if (cellGrid[this.x - i][this.y - i].val == sameVal) {

              break;
            } else {

              toSwitch.push(cellGrid[this.x - i][this.y - i]);
            }
          }
        }
      }
    }

    for (let i = 0; i < toSwitch.length; i++) {

      toSwitch[i].val = 1 + switchInt(toSwitch[i].val - 1);

      if (switchInt(toSwitch[i].val - 1) == 1) {
        totalWhite++;
        totalBlack--;
      } else {
        totalBlack++;
        totalWhite--;
      }
    }

    moveChoices = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        cellGrid[i][j].updateValidity();
      }
    }
  }

  preview () {//------------------------------------------------------------------------------------------

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 6; j++) {

        cellGrid[i][j].displayVal = 0;
      }
    }

    this.displayVal = turn + 1;

    let toSwitch = [];

    let distanceN = this.y;
    let distanceE = 7 - this.x;
    let distanceS = 7 - this.y;
    let distanceW = this.x;

    let distanceNE;
    if (distanceN > distanceE) {
      distanceNE = distanceE;
    } else {
      distanceNE = distanceN;
    }

    let distanceSW;
    if (distanceN > distanceW) {
      distanceSW = distanceW;
    } else {
      distanceSW = distanceN;
    }

    let opVal = 1 + switchInt(turn);
    let sameVal = 1 + turn;

    if (this.n) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x][this.y - i] != undefined) {

          if (cellGrid[this.x][this.y - i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x][this.y - i]);
          }
        }
      }
    }

    if (this.ne) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x + i][this.y - i] != undefined) {

          if (cellGrid[this.x + i][this.y - i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x + i][this.y - i]);
          }
        }
      }
    }

    if (this.e) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x + i][this.y] != undefined) {

          if (cellGrid[this.x + i][this.y].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x + i][this.y]);
          }
        }
      }
    }

    if (this.se) {

      for (let i = 1; i < 8; i++) {

        if (this.x + i < 8 && this.y + i < 8) {

          if (cellGrid[this.x + i][this.y + i] != null) {

            if (cellGrid[this.x + i][this.y + i].val == sameVal || cellGrid[this.x + i][this.y + i].val == 0)  {

              break;
            } else {

              toSwitch.push(cellGrid[this.x + i][this.y + i]);
            }
          }
        }
      }
    }

    if (this.s) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x][this.y + i] != null) {

          if (cellGrid[this.x][this.y + i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x][this.y + i]);
          }
        }
      }
    }

    if (this.sw) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x - i][this.y + i] != null) {

          if (cellGrid[this.x - i][this.y + i].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x - i][this.y + i]);
          }
        }
      }
    }

    if (this.w) {

      for (let i = 1; i < 8; i++) {

        if (cellGrid[this.x - i][this.y] != null) {

          if (cellGrid[this.x - i][this.y].val == sameVal) {

            break;
          } else {

            toSwitch.push(cellGrid[this.x - i][this.y]);
          }
        }
      }
    }

    if (this.nw) {

      for (let i = 1; i < 8; i++) {

        if (this.x - i >= 0 && this.y - i >= 0) {
          if (cellGrid[this.x - i][this.y - i] != null) {

            if (cellGrid[this.x - i][this.y - i].val == sameVal) {

              break;
            } else {

              toSwitch.push(cellGrid[this.x - i][this.y - i]);
            }
          }
        }
      }
    }

    for (let i = 0; i < toSwitch.length; i++) {

      toSwitch[i].displayVal = 1 + turn;

      if (1 + turn == 1) {
        addedWhite++;
        addedBlack--;
      } else {
        addedBlack++;
        addedWhite--;
      }
    }
  }
}

function go (x, y) {

  cellGrid[x][y].val = turn + 1;
  cellGrid[x][y].finalizeChoice();
  if (turn == 0) {

    totalWhite++;
  } else {

    totalBlack++;
  }

  turn = switchInt(turn);

  moveChoices = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {

      cellGrid[i][j].updateValidity();
    }
  }
  print("redrew");
  redraw();
}

function mousePressed(event) {

  if (mouseOnGame && cellGrid[mousePosX][mousePosY].validMove && !gameOver && turn == 0) {

    go(mousePosX, mousePosY);
  }
}

function mouseMoved(event) {

  if (floor(mouseX / 50) != lastX || floor(mouseY / 50) != lastY) {

    if (keyCode != ESCAPE && !gameOver) {

      redraw();
      print("redrew");
    }
  }
}

function keyPressed () {

  if (gameOver && key == ' ') {

    reload();
  }
}

function switchInt (int) {

  if (int == 0) {

    return 1;
  } else {

    return 0;
  }
}
