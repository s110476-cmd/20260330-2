let gridSize = 80;
let targetCol, targetRow;
let gameState = "start"; // start, playing, win, lose
let startTime;
let timeLimit = 30; // 秒

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function resetGame() {
  targetCol = floor(random(width / gridSize));
  targetRow = floor(random(height / gridSize));
  startTime = millis();
  gameState = "playing";
}

function draw() {
  background(0); // 黑色畫布

  if (gameState === "start") {
    drawEndScreen("RADAR GAME", color(255));
    
  } else if (gameState === "playing") {
    let cols = floor(width / gridSize);
    let rows = floor(height / gridSize);
    let elapsed = (millis() - startTime) / 1000;
    let timeLeft = max(0, timeLimit - elapsed);

    if (timeLeft <= 0) {
      gameState = "lose";
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * gridSize;
        let y = j * gridSize;

        // 繪製方框
        stroke(40); // 暗灰色邊框
        noFill(); // 隱藏幸運色塊，不直接顯示紅色
        
        rect(x, y, gridSize, gridSize);

        // 雷達感應邏輯
        if (mouseX >= x && mouseX < x + gridSize && mouseY >= y && mouseY < y + gridSize) {
          let d = dist(i, j, targetCol, targetRow);
          let maxDetectionDist = 12; // 偵測範圍
          
          let circleSize = map(d, 0, maxDetectionDist, gridSize * 0.8, 2, true);
          let blueIntensity = map(d, 0, maxDetectionDist, 255, 50, true);
          
          fill(0, 150, blueIntensity);
          noStroke();
          ellipse(x + gridSize / 2, y + gridSize / 2, circleSize);
        }
      }
    }

    // 顯示時間
    fill(255);
    noStroke();
    textSize(32);
    textAlign(CENTER, TOP);
    text("REMAINING TIME: " + nf(timeLeft, 1, 1) + "s", width / 2, 20);

  } else if (gameState === "win") {
    drawEndScreen("YOU WIN!", color(0, 255, 100));
  } else if (gameState === "lose") {
    drawEndScreen("GAME OVER", color(255, 50, 50));
  }
}

function drawEndScreen(msg, clr) {
  textAlign(CENTER, CENTER);
  fill(clr);
  textSize(64);
  text(msg, width / 2, height / 2);
  textSize(24);
  fill(255);
  if (gameState === "start") {
    text("Click to Start Game", width / 2, height / 2 + 60);
  } else {
    text("Click to Restart", width / 2, height / 2 + 60);
  }
}

function mousePressed() {
  if (gameState === "playing") {
    let col = floor(mouseX / gridSize);
    let row = floor(mouseY / gridSize);
    if (col === targetCol && row === targetRow) {
      gameState = "win";
    }
  } else {
    resetGame();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
