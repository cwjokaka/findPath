function Point(x,y){
  this.x = x;
  this.y = y;
}
Point.prototype = {
  prePoint : null,
  valueG : 0,
  valueH : 0,
  valueF : 0,
  setPrePoint : function(prePoint){
    this.prePoint = prePoint;
  },
  getPrePoint : function(){
    return this.prePoint;
  },
  calG : function(){
    this.valueG = this.prePoint.valueG + 1;
  },
  calH : function(endPoint){
    this.valueH = Math.abs(this.x - endPoint.x) + Math.abs(this.y-endPoint.y);
  },
  calF : function(){
    this.valueF = this.valueG + this.valueH;
  }
};

function Block(x,y){
  Point.call(this,x,y);
  this.color = 'black';
}
Block.prototype = {
  setColor : function(color){
    this.color = color;
  },
  drawSelf : function(context){
    context.save();
    context.fillStyle = this.color;
    context.fillRect(this.x*BLOCK_SIZE,this.y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
    context.restore();
  },
};

function Hero(x,y){
  Block.call(this,x,y);
  this.color = 'red';
  this.curPoint = null;
}
Hero.prototype = Block.prototype;
