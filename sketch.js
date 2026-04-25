let cols, rows;
let padding;
let topMargin;
let cells = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGrid();
}

function draw() {
  background(5); 
  drawHeader();
  
  let isHovering = cells.some(cell => cell.isHovered);
  cursor(isHovering ? HAND : ARROW);

  for (let cell of cells) {
    cell.update();
    cell.display();
  }
}

function drawHeader() {
  // Scale header based on width
  let titleSize = width < 600 ? 24 : 32;
  let subSize = width < 600 ? 9 : 12;
  
  push();
  textAlign(LEFT, TOP);
  translate(padding, height * 0.05); // Responsive top placement
  
  fill(255);
  textFont('Inter');
  textSize(titleSize);
  textStyle(BOLD);
  text("chromaWeave", 0, 0);
  
  fill(120);
  textSize(subSize);
  textStyle(NORMAL);
  let subText = width < 600 ? "KINETIC AUDIO TAPESTRIES" : "GENERATIVE TRANSLATION OF SOUND INTO KINETIC TAPESTRIES";
  text(subText, 0, titleSize + 10);
  
  stroke(255, 25);
  strokeWeight(1);
  line(0, titleSize + 35, width - (padding * 2), titleSize + 35);
  pop();
}

function calculateGrid() {
  cells = [];
  
  // Mobile vs Web Logic
  if (width < 600) {
    cols = 2;
    rows = 8;
    padding = 30; // Tighter padding for small screens
    topMargin = 120;
  } else {
    cols = 4;
    rows = 4;
    padding = 80;
    topMargin = 160;
  }

  let gridW = width - (padding * 2);
  let gridH = height - topMargin - padding;
  let cellW = gridW / cols;
  let cellH = gridH / rows;

  for (let i = 0; i < 16; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = padding + col * cellW;
    let y = topMargin + row * cellH;
    
    let id = i + 1;
    let formattedId = nf(id, 2); 
    let targetLink = `https://riannaphillips152-crypto.github.io/variation_${formattedId}/`;
    
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
    // Touch and Mouse support
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
    
    //  thread density for mobile
    let step = width < 600 ? 10 : 12;
    let sidePadding = width < 600 ? 20 : 35;

    for (let i = sidePadding; i < this.w - sidePadding; i += step) {
      let threadHue = (this.id * 25 + i) % 360;
      colorMode(HSB, 360, 100, 100, 1);
      let wave = sin(this.animTimer + i * 0.25) * (15 * this.hoverLerp);
      let opacity = map(this.hoverLerp, 0, 1, 0.15, 0.95);
      
      if (this.hoverLerp > 0.1) {
        drawingContext.shadowBlur = 10 * this.hoverLerp;
        drawingContext.shadowColor = color(threadHue, 80, 100, 0.5);
      }

      stroke(threadHue, 70, 100, opacity);
      strokeWeight(map(this.hoverLerp, 0, 1, 1, 2));
      line(i, 30 + wave, i, this.h - 30 - wave);
      drawingContext.shadowBlur = 0;
    }

    noFill();
    stroke(255, map(this.hoverLerp, 0, 1, 30, 180));
    rect(10, 10, this.w - 20, this.h - 20, 2);
    
    fill(255, map(this.hoverLerp, 0, 1, 120, 255));
    noStroke();
    textSize(width < 600 ? 9 : 11);
    text(`VARIATION ${nf(this.id, 2)}`, 20, this.h - 20);
    pop();
  }

  clicked() {
    if (this.isHovered) window.location.href = this.link;
  }
}

function mousePressed() {
  for (let cell of cells) {
    cell.clicked();
  }
}

// Mobile rotation or browser resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid();
}
