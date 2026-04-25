/**
 * CHROMAWEAVE: Digital Tapestry Homepage
 * professional edits: Features motion easing, glow effects, and grid-wide routing.
 */

let cols = 4;
let rows = 5;
let padding = 80;
let topMargin = 160; // Increased for a cleaner header
let cells = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGrid();
}

function draw() {
  // Deep obsidian background for professional contrast
  background(5); 
  
  drawHeader();
  
  // Set cursor based on interaction
  let isHovering = cells.some(cell => cell.isHovered);
  cursor(isHovering ? HAND : ARROW);

  // Render the grid
  for (let cell of cells) {
    cell.update();
    cell.display();
  }
}

function drawHeader() {
  push();
  textAlign(LEFT, TOP);
  translate(padding, 50);
  
  // Primary Title
  fill(255);
  textFont('Inter', 'Helvetica'); // Falls back to Helvetica if Inter isn't loaded
  textSize(32);
  textStyle(BOLD);
  text("chromaWeave", 0, 0);
  
  // Subtitle / Description
  fill(120);
  textSize(11);
  textStyle(NORMAL);
  textFont('JetBrains Mono', 'monospace');
  text("TRANSFORMING SOUND INTO DIGITAL TAPESTRIES // V.2026.4", 0, 45);
  
  // Decorative separator line
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

  for (let i = 0; i < 20; i++) {
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
    this.hoverLerp = 0; // Used for smooth fading transitions
    this.animTimer = 0;
  }

  update() {
    // Check for hover
    let isInside = (mouseX > this.x && mouseX < this.x + this.w && 
                    mouseY > this.y && mouseY < this.y + this.h);
    this.isHovered = isInside;

    // Smoothly transition the hover value (lerping)
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
    
    // 1. Draw "Thread" Lines
    for (let i = 30; i < this.w - 30; i += 10) {
      let threadHue = (this.id * 22 + i) % 360;
      colorMode(HSB, 360, 100, 100, 1);
      
      // Calculate sine wave movement based on hover lerp
      let wave = sin(this.animTimer + i * 0.2) * (15 * this.hoverLerp);
      let opacity = map(this.hoverLerp, 0, 1, 0.15, 0.9);
      
      // Add neon glow ONLY on hover
      if (this.hoverLerp > 0.1) {
        drawingContext.shadowBlur = 12 * this.hoverLerp;
        drawingContext.shadowColor = color(threadHue, 80, 100, 0.5);
      }

      stroke(threadHue, 75, 100, opacity);
      strokeWeight(map(this.hoverLerp, 0, 1, 1, 2));
      line(i, 35 + wave, i, this.h - 35 - wave);
      
      // Reset glow for performance
      drawingContext.shadowBlur = 0;
    }

    // Minimal Grid Border
    noFill();
    stroke(255, map(this.hoverLerp, 0, 1, 30, 180));
    strokeWeight(1);
    rect(15, 15, this.w - 30, this.h - 30, 2);
    
    // Technical ID Label (V.01, V.02, etc)
    fill(255, map(this.hoverLerp, 0, 1, 100, 255));
    noStroke();
    textFont('JetBrains Mono', 'monospace');
    textSize(10);
    textAlign(LEFT);
    let idLabel = this.id.toString().padStart(2, '0');
    text(`V.${idLabel}`, 25, this.h - 25);
    
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
