setup = () => {
  createCanvas(400, 400);
  for(let i=0; i<12; i+=1){
  let p = new Vec2(90*(i%4)+50, 50*floor(i/4)+50);
  blocks.push(new Block(p, 20));
}
}
class Vec2 {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }
  // このベクトルと、引数のベクトルbの和を計算する
  add(b) {
    let a = this;
    return new Vec2(a.x+b.x,a.y+b.y);
  }
  // このベクトルを実数s倍したベクトルを計算する
  mul(s) {
    let a = this;
    return new Vec2(s*a.x,s*a.y)
  }
  // このベクトルの大きさを求める
  mag() {
    let a = this;
    return sqrt(a.x**2 + a.y**2);
  }
  // このベクトルと引数のベクトルbの差を求める
  sub(b) {
    let　a = this;
    return new Vec2(a.x-b.x, a.y-b.y);
  }
  norm() {
    let a = this;
    return a.mul(1/a.mag());
  }
  // このベクトルと引数のベクトルbの内積を求める
  dot(b) {
    let a = this;
    return a.x*b.x + a.y*b.y;
  }
  reflect(w) {
    let v = this;
    let cosThete = v.mul(-1).dot(w) / (v.mul(-1).mag() * w.mag());
    let n = w.norm().mul(v.mag() * cosThete);
    let r = v.add(n.mul(2));
    return r;
  }
}
// 2つのベクトルa,bの和を計算
Vec2Add = (a,b) => new Vec2(a.x+b.x, a.y+b.y);

// ベクトルaの実数s倍を求める
Vec2Mul = (a, s) => new Vec2(s*a.x, s*a.y);

let score=0;

reflectWall = () => {
  if (ball.p.x > 385 || ball.p.x < 15 ){
    ball.v.x = -ball.v.x;
    addScore();
  }
  if (ball.p.y > 385 || ball.p.y < 15 ){
    ball.v.y = -ball.v.y;
    addScore(); 
  }
}

addScore = () => {
  score+=1;
}


class Ball {
  constructor(_p, _v, _r) {
    this.p = _p;
    this.v = _v;
    this.r = _r;
  }
}


class Block {
  constructor(_p, _r) {
    this.p = _p; // ブロックの中心の位置ベクトル
    this.r = _r; // ボールの半径
  }
}

class Paddle { 
  constructor(_p, _r) {
    this.p = _p;
    this.r = _r;
  }
}


// ボールを作る
let ball = new Ball(
  new Vec2(200, 300),
  new Vec2(240, -60),
  15
);

// ブロックを作る
let blocks = [];

// パドルを作る
let paddle = new Paddle(new Vec2(200, 320), 30);


draw = () => {
  // ボールを移動させる
  reflectWall();
  ball.p = ball.p.add(ball.v.mul(1/60));
  // ボールとブロックの衝突判定
  for (let block of blocks) {    
      let d = block.p.sub(ball.p).mag();
      if(d < (ball.r+block.r)) {
        let w = ball.p.sub(block.p);
        let r = ball.v.reflect(w);
        ball.v = r;
        // 減り込み防止
        // 
        blocks.splice(blocks.indexOf(block), 1);
      }
  }
  // パドルの操作
  paddle.p.x = mouseX;
  // paddle.p.y = mouseY;
  // ボールとパドルの衝突判定
  let d = paddle.p.sub(ball.p).mag();
      if(d < (ball.r+paddle.r)) {
        let w = ball.p.sub(paddle.p);
        let r = ball.v.reflect(w);
        ball.v = r;
        ball.p = paddle.p.add(w.norm().mul(ball.r + paddle.r));
      }
    
  // 画面を塗りつぶす
  background(220);
  // ボールを描画
  circle(ball.p.x, ball.p.y, 30);
  //ブロックを描画
  for(let b of blocks){
    circle(b.p.x, b.p.y, 2*b.r);
  }
  circle(paddle.p.x, paddle.p.y, 2*paddle.r);
}