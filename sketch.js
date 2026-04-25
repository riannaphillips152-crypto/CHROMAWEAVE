let cols = 4;
let rows = 4; // Changed to 4 for a 4x4 grid
let padding = 80;
let topMargin = 160;
let cells = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGrid();
}

function draw() {
  background(5); // Solid obsidian black
  
  drawHeader();
  
  let isHovering = cells.some(cell => cell.isHovered);
  cursor(isHovering ? HAND : ARROW);

  for (let cell of cells) {
    cell.update();
    cell.display();
  }
}

function drawHeader() {
  push();
  textAlign(LEFT, TOP);
  translate(padding, 50);
  
  fill(255);
  textFont('Inter');
  textSize(32);
  textStyle(BOLD);
  text("CHROMAWEAVE", 0, 0);
  
  fill(120);
  textSize(12);
  textStyle(NORMAL);
  text("TRANSFORMING SOUND INTO DIGITAL TAPESTRY", 0, 45);
  
  stroke(255, 25);
  strokeWeight(1);
  line(0, 70, width - (padding * 2), 70);
  pop();
}

function calculateGrid() {
  cells = [];
  let gridW = width - (padding * 2);
  let gridH = height - topMargin - padding;
  let cellW = gridW / cols;
  let cellH = gridH / rows;

  for (let i = 0; i < 16; i++) { // Loop restricted to 16
    let col = i % cols;
    let row = floor(i / cols);
    let x = padding + col * cellW;
    let y = topMargin + row * cellH;
    
    let id = i + 1;
    let targetLink = `./variation-${id}.html`;
    
    cells.push(new GridCell(x, y, cellW, cellH, id, targetLink));
  }
}

class GridCell {
  constructor(x, y, w, h, id, link) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.link = link;
    this.isHovered = false;
    this.hoverLerp = 0;
    this.animTimer = 0;
  }

  update() {
    let isInside = (mouseX > this.x && mouseX < this.x + this.w && 
                    mouseY > this.y && mouseY < this.y + this.h);
    this.isHovered = isInside;

    if (this.isHovered) {
      this.hoverLerp = lerp(this.hoverLerp, 1, 0.1);
      this.animTimer += 0.05;
    } else {
      this.hoverLerp = lerp(this.hoverLerp, 0, 0.1);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // Render Neon Threads
    for (let i = 35; i < this.w - 35; i += 12) {
      let threadHue = (this.id * 25 + i) % 360;
      colorMode(HSB, 360, 100, 100, 1);
      
      let wave = sin(this.animTimer + i * 0.25) * (18 * this.hoverLerp);
      let opacity = map(this.hoverLerp, 0, 1, 0.15, 0.95);
      
      if (this.hoverLerp > 0.1) {
        drawingContext.shadowBlur = 15 * this.hoverLerp;
        drawingContext.shadowColor = color(threadHue, 80, 100, 0.5);
      }

      stroke(threadHue, 70, 100, opacity);
      strokeWeight(map(this.hoverLerp, 0, 1, 1, 2.5));
      line(i, 40 + wave, i, this.h - 40 - wave);
      
      drawingContext.shadowBlur = 0;
    }

    // Border
    noFill();
    stroke(255, map(this.hoverLerp, 0, 1, 30, 180));
    strokeWeight(1);
    rect(15, 15, this.w - 30, this.h - 30, 2);
    
    // Variation Title
    fill(255, map(this.hoverLerp, 0, 1, 120, 255));
    noStroke();
    textFont('Inter');
    textSize(11);
    textAlign(LEFT);
    text(`VARIATION ${this.id}`, 25, this.h - 25);
    
    pop();
  }

  clicked() {
    if (this.isHovered) {
      window.location.href = this.link;
    }
  }
}

function mousePressed() {
  for (let cell of cells) {
    cell.clicked();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid();
}