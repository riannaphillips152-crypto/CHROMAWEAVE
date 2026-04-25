let cols = 4;
let rows = 5;
let padding = 60;
let topMargin = 120;
let cells = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGrid();
}

function draw() {
  clear(); // Maintain transparency
  
  // Header
  textAlign(CENTER, CENTER);
  fill(255); 
  textSize(32);
  textStyle(BOLD);
  text("chromaWeave", width / 2, 40);
  
  textSize(14);
  textStyle(ITALIC);
  fill(200);
  text("Transforming audio into digital tapestries", width / 2, 70);
  
  // Update cursor if hovering over any clickable cell
  let isHovering = cells.some(cell => cell.isHovered);
  cursor(isHovering ? HAND : ARROW);

  // Render Grid
  for (let cell of cells) {
    cell.update();
    cell.display();
  }
}

function calculateGrid() {
  cells = [];
  let gridW = width - (padding * 2);
  let gridH = height - topMargin - padding;
  let cellW = gridW / cols;
  let cellH = gridH / rows;

  for (let i = 0; i < 20; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = padding + col * cellW;
    let y = topMargin + row * cellH;
    
    // Each cell gets a unique ID and its own variation link
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
    this.animTimer = 0;
  }

  update() {
    this.isHovered = (mouseX > this.x && mouseX < this.x + this.w && 
                      mouseY > this.y && mouseY < this.y + this.h);
    if (this.isHovered) this.animTimer += 0.08;
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // Animated Colorful Threads
    strokeWeight(1.5);
    for (let i = 20; i < this.w - 20; i += 8) {
      let threadHue = (this.id * 18 + i) % 360;
      push();
      colorMode(HSB, 360, 100, 100, 1);
      
      let offset = this.isHovered ? sin(this.animTimer + i * 0.3) * 10 : 0;
      let opacity = this.isHovered ? 1 : 0.2;
      
      stroke(threadHue, 80, 100, opacity);
      line(i, 25 + offset, i, this.h - 25 - offset);
      pop();
    }

    // Border
    noFill();
    stroke(this.isHovered ? 255 : 80, 150);
    strokeWeight(this.isHovered ? 2 : 1);
    rect(10, 10, this.w - 20, this.h - 20, 4);
    
    // Variation Title
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text(`VARIATION ${this.id}`, this.w / 2, this.h / 2);
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
