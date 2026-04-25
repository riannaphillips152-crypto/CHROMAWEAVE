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
  clear(); // Keep background transparent
  
  // Header Text
  textAlign(CENTER, CENTER);
  fill(255); 
  textSize(36);
  textStyle(BOLD);
  text("chromaWeave", width / 2, 40);
  
  textSize(16);
  textStyle(ITALIC);
  fill(200);
  text("Transforming audio into digital tapestries", width / 2, 75);
  
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
    cells.push(new GridCell(x, y, cellW, cellH, i + 1));
  }
}

class GridCell {
  constructor(x, y, w, h, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.isHovered = false;
    this.animTimer = 0;
  }

  update() {
    this.isHovered = (mouseX > this.x && mouseX < this.x + this.w && 
                      mouseY > this.y && mouseY < this.y + this.h);
    
    if (this.isHovered) {
      this.animTimer += 0.08; 
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    //  Multicolored Animated Lines
    strokeWeight(1.5);
    for (let i = 20; i < this.w - 20; i += 8) {
      // Calculate a unique hue for every single thread
      // Based on cell ID and thread position
      let threadHue = (this.id * 15 + i) % 360;
      
      push();
      colorMode(HSB, 360, 100, 100, 1);
      
      // Lines glow brighter and move when hovered
      let offset = this.isHovered ? sin(this.animTimer + i * 0.3) * 12 : 0;
      let opacity = this.isHovered ? 1 : 0.3;
      let brightness = this.isHovered ? 100 : 60;
      
      stroke(threadHue, 70, brightness, opacity);
      line(i, 20 + offset, i, this.h - 20 - offset);
      pop();
    }

    // Border
    noFill();
    stroke(this.isHovered ? 255 : 100, 100);
    strokeWeight(this.isHovered ? 2 : 1);
    rect(10, 10, this.w - 20, this.h - 20, 4);
    
    // Variation Label
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(NORMAL);
    text(`VARIATION ${this.id}`, this.w / 2, this.h / 2);
    
    pop();
  }

  clicked() {
    if (this.isHovered) {
      window.location.href = `variation-${this.id}.html`;
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