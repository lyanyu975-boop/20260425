let seaweeds = [];
let bubbles = [];
let fishes = [];
let envBubbles = []; // 環境上升氣泡
let myIframe, closeBtn, startBtn;
let gameState = 'intro'; // 遊戲狀態：'intro' (入口) 或 'game' (海底)

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 初始化 Iframe (建立在畫布上方或指定位置)
  myIframe = createElement('iframe');
  let iframeW = 800;
  let iframeH = 500;
  myIframe.size(iframeW, iframeH);
  myIframe.position((windowWidth - iframeW) / 2, (windowHeight - iframeH) / 2);
  myIframe.style('border', '2px solid #fff');
  myIframe.style('border-radius', '15px');
  myIframe.style('background', 'white');
  myIframe.hide();

  // 建立關閉按鈕
  closeBtn = createButton('關閉展覽 (X)');
  closeBtn.position((windowWidth + iframeW) / 2 - 100, (windowHeight - iframeH) / 2 - 40);
  closeBtn.style('background', '#ff4444');
  closeBtn.style('color', 'white');
  closeBtn.style('border', 'none');
  closeBtn.style('padding', '10px');
  closeBtn.style('cursor', 'pointer');
  closeBtn.mousePressed(() => { myIframe.hide(); closeBtn.hide(); });
  closeBtn.hide();

  // 建立進入按鈕
  startBtn = createButton('進入海底世界');
  startBtn.position(windowWidth / 2 - 60, windowHeight / 2 + 60);
  startBtn.style('padding', '10px 20px');
  startBtn.style('background', '#44aaff');
  startBtn.style('color', 'white');
  startBtn.style('border', 'none');
  startBtn.style('border-radius', '5px');
  startBtn.style('cursor', 'pointer');
  startBtn.mousePressed(() => { gameState = 'game'; startBtn.hide(); });

  // 產生海草 (利用陣列與 Class)
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let h = random(150, 500);
    seaweeds.push(new Seagrass(x, h));
  }

  // 產生兩邊的作品泡泡 (左邊 1-4 週, 右邊 5-8 週)
  let urls = [
    "https://lyanyu975-boop.github.io/20260316/",
    "https://lyanyu975-boop.github.io/20260323/",
    "https://lyanyu975-boop.github.io/20260330/",
    "https://lyanyu975-boop.github.io/20260406/"
  ];

  let labels = [
    "第一周作品", "第二周作品",
    "電流急急棒", "雷達找顏色"
  ];

  // 產生兩邊的作品泡泡 (兩邊各兩個)
  for (let i = 0; i < 2; i++) {
    // 左側泡泡 (Index 0, 1)
    bubbles.push(new ProjectBubble(100, height / 2 - 100 + i * 200, labels[i], urls[i]));
    // 右側泡泡 (Index 2, 3)
    bubbles.push(new ProjectBubble(width - 100, height / 2 - 100 + i * 200, labels[i + 2], urls[i + 2]));
  }

  // 新增：筆記與攝影機氣泡
  bubbles.push(new ProjectBubble(width / 2 - 120, height - 100, "筆記", ""));
  bubbles.push(new ProjectBubble(width / 2 + 120, height - 100, "攝影機", "https://lyanyu975-boop.github.io/20260420/"));

  // 產生隨機魚群
  for (let i = 0; i < 20; i++) {
    fishes.push(new Fish());
  }

  // 產生初始環境氣泡
  for (let i = 0; i < 15; i++) {
    envBubbles.push(new EnvBubble());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  myIframe.position((windowWidth - 800) / 2, (windowHeight - 500) / 2);
  closeBtn.position((windowWidth + 800) / 2 - 100, (windowHeight - 500) / 2 - 40);
  if (startBtn) startBtn.position(windowWidth / 2 - 60, windowHeight / 2 + 60);
}

function draw() {
  if (gameState === 'intro') {
    // 入口畫面
    background(10, 30, 60);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text('期中報告', width / 2, height / 2 - 40);
    textSize(24);
    text('414730266 留妍瑜', width / 2, height / 2 + 20);
    return; // 不執行後續的海底繪製
  }

  // 深海漸層背景
  background(10, 30, 60);
  
  // 繪製裝飾性光影
  noStroke();
  fill(255, 255, 255, 10);
  ellipse(width / 2, 0, 800, 400);

  // 處理背景氣泡
  envBubbles.forEach((eb, index) => {
    eb.move();
    eb.display();
  });

  // 更新並顯示海草
  seaweeds.forEach(s => {
    s.sway();
    s.display();
  });

  // 更新並顯示魚群
  fishes.forEach(f => {
    f.move();
    f.display();
  });

  // 顯示作品泡泡
  bubbles.forEach(b => {
    b.display();
  });
}

function mousePressed() {
  if (gameState !== 'game') return;
  // 偵測泡泡點擊
  bubbles.forEach(b => {
    if (b.isClicked(mouseX, mouseY) && b.url !== "") {
      myIframe.attribute('src', b.url);
      myIframe.show(); 
      closeBtn.show(); // 點擊後顯示關閉鈕
    }
  });
}

// --- 類別定義 ---

// 海草類別：展示學習成長與動態搖擺
class Seagrass {
  constructor(x, h) {
    this.x = x;
    this.h = random(100, 600); // 隨機高度
    this.w = random(10, 40);  // 隨機寬度 (增加大小隨機性)
    this.off = random(1000); // 隨機偏移量用於 noise
    this.c = color(40, random(100, 180), 80, 150); // 增加透明感
  }

  sway() {
    this.off += 0.01;
  }

  display() {
    fill(this.c);
    noStroke();
    beginShape();
    // 繪製水草葉片，由下往上再回到下方
    for (let i = 0; i <= 10; i++) {
      let y = height - (i * this.h / 10);
      let xOffset = map(noise(this.off + i * 0.1), 0, 1, -this.h/15, this.h/15);
      let taper = map(i, 0, 10, this.w, 2);
      vertex(this.x + xOffset - taper/2, y);
    }
    for (let i = 10; i >= 0; i--) {
      let y = height - (i * this.h / 10);
      let xOffset = map(noise(this.off + i * 0.1), 0, 1, -this.h/15, this.h/15);
      let taper = map(i, 0, 10, this.w, 2);
      vertex(this.x + xOffset + taper/2, y);
    }
    endShape();
  }
}

// 環境上升氣泡類別
class EnvBubble {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = random(width);
    this.y = height + random(100);
    this.size = random(5, 15);
    this.speed = random(1, 3);
  }
  move() {
    this.y -= this.speed;
    // 隨機破掉或飄出頂部
    if (this.y < -20 || (this.y < height * 0.8 && random(1) < 0.005)) {
      this.reset();
    }
  }
  display() {
    stroke(255, 100);
    noFill();
    ellipse(this.x, this.y, this.size);
  }
}

// 魚類別：使用 Vertex 勾勒生物輪廓
class Fish {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(2, 5));
    this.c = color(random(100, 255), random(100, 200), random(255), 150);
  }

  move() {
    // 避開滑鼠邏輯
    let mouseVec = createVector(mouseX, mouseY);
    let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (d < 200) {
      let push = p5.Vector.sub(this.pos, mouseVec);
      push.setMag(0.5);
      this.vel.add(push); // 被滑鼠「推開」
    }

    this.vel.limit(6);
    this.pos.add(this.vel);
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.vel.x < 0) scale(-1, 1);
    fill(this.c);
    noStroke();
    // 使用 Vertex 畫魚身
    beginShape();
    vertex(0, 0);
    bezierVertex(10, -10, 25, -10, 30, 0); // 背部
    bezierVertex(25, 10, 10, 10, 0, 0);    // 腹部
    endShape();
    // 魚尾
    triangle(-5, 0, -15, -10, -15, 10);
    pop();
  }
}

// 作品泡泡類別：作為 iframe 的觸發器
class ProjectBubble {
  constructor(x, y, label, url) {
    this.x = x; this.y = y; this.label = label; this.url = url;
    this.size = 90;
  }
  display() {
    fill(255, 255, 255, 40);
    stroke(255, 150);
    ellipse(this.x, this.y, this.size);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }
  isClicked(mx, my) {
    return dist(mx, my, this.x, this.y) < this.size / 2;
  }
}
