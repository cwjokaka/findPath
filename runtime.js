//画布初始化
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

var startPoint = null;
var endPoint = null;
var hero = null;
var blocks = [];
var openList = [];
var closeList = [];

init();

//按键逻辑
addEventListener("keydown",function(ele){
  if(ele.keyCode == 38 && mg[hero.x][hero.y-1] != 1){
    hero.y -= 1;
  }
  if(ele.keyCode == 40 && mg[hero.x][hero.y+1] != 1){
    hero.y += 1;
  }
  if(ele.keyCode == 37 && mg[hero.x-1][hero.y] != 1){
    hero.x -= 1;
  }
  if(ele.keyCode == 39 && mg[hero.x+1][hero.y] != 1){
    hero.x += 1;
  }
  if(ele.keyCode == 32){
    findPath();


    //console.log("closeList:"+closeList);
    //console.log("openList:"+openList);
  }
  reDraw();
});

//游戏初始化
function init(){
  for(var i=0;i<mg.length;i++){
    for(var j=0;j<mg.length;j++){
      if(mg[i][j] == 1){
        var block = new Block(i,j);
        blocks.push(block);
      }
      else if(mg[i][j] == 2){
        var block = new Block(i,j);
        hero = new Hero(i,j);
        startPoint = new Point(i,j);
        hero.curPoint = startPoint;
        block.setColor('green');
        blocks.push(block);
      }
      else if(mg[i][j] == 3){
        endPoint = new Point(i,j);
        hero.curPoint.valueG = 0;
        hero.curPoint.calH(endPoint);
        hero.curPoint.calF();
        console.log("startPoint:G:"+startPoint.valueG+" H:"+startPoint.valueH+" F:"+startPoint.valueF);
        var block = new Block(i,j);
        block.setColor('yellow')
        blocks.push(block);
      }
    }
  }
  reDraw();
}

//重绘画布
function reDraw(){
  context.clearRect(0,0,500,500);
  for(var i=0;i<blocks.length;i++){
    blocks[i].drawSelf(context);
  }
  hero.drawSelf(context);
}

//寻路
function findPath(){

  //可供考虑下一步的列表
  var thinkList = [];
  //hero当前点，开始时是startPoint(1,1)
  var curPoint = hero.curPoint;

  //closeList Part
  //先将英雄脚下的点加入closeList
  checkCloseList(curPoint);

  //openList Part
  thinkList = checkOpenList(curPoint);


  //如果有可选的路走
  if(thinkList.length>0){
    //按F值从小到大排序
    thinkList.sort(function(a,b){
      return a.valueF - b.valueF;
    });
    //取出F值最小的point
    var nextPoint = thinkList[0];
    //hero前往nextPoint,并记录它所在的当前点
    hero.x = nextPoint.x;
    hero.y = nextPoint.y;
    hero.curPoint = nextPoint;

  }
  //如果没有路,向prePoint走
  else{
    console.log("没路了");
    //遍历openList,从中选出上下左右可走的路
    for (var i=0;i<openList.length;i++){
      if (openList[i].x == hero.x && openList[i].y == hero.y+1){
        thinkList.push(openList[i]);
      }
      if (openList[i].x == hero.x && openList[i].y == hero.y-1){
        thinkList.push(openList[i]);
      }
      if (openList[i].x == hero.x+1 && openList[i].y == hero.y){
        thinkList.push(openList[i]);
      }
      if (openList[i].x == hero.x-1 && openList[i].y == hero.y){
        thinkList.push(openList[i]);
      }
    }
    //如果找到路了
    if (thinkList.length>0){
      //按F值从小到大排序
      thinkList.sort(function(a,b){
        return a.valueF - b.valueF;
      });
      //取出F值最小的point
      var nextPoint = thinkList[0];
      //hero前往nextPoint,并记录它所在的当前点
      hero.x = nextPoint.x;
      hero.y = nextPoint.y;
      hero.curPoint = nextPoint;

      for (var i=0;i<openList.length;i++){
        if(hero.curPoint.x == openList[i].x && hero.curPoint.y == openList[i].y){
          openList.splice(i,1);
        }
      }
    }
    //如果还是没有路走,那么只能后退
    else{
      console.log("真的没路了,回头");
      hero.x = hero.curPoint.getPrePoint().x;
      hero.y = hero.curPoint.getPrePoint().y;
    //  console.log("x:"+hero.curPoint.getPrePoint().x + "y:"+hero.curPoint.getPrePoint().y);
      hero.curPoint = hero.curPoint.getPrePoint();
    }
  }
}

function checkCloseList(point){
  for (var i in openList){
    if (point == openList[i]){
      openList.splice(i,1);
    }
  }
  for (var i in closeList){
    if (point.x == closeList[i].x && point.y == closeList[i].y){
      console.log("closeList中已有这个点");
      return;
    }
  }
  console.log("插入closeList");
  closeList.push(point);
  //测试
  for (var i=0;i<closeList.length;i++){
    console.log("closeList:x:"+closeList[i].x+"y:"+closeList[i].y);
  }
}

//检查当前点周围可插入openList的点,并返回
function checkOpenList(point){
  var select = [];

  if (mg[point.x][point.y-1] != 1){
    var pointU = new Point(point.x,point.y-1);
    var flag = true;
    for (var j in closeList){
      if (pointU.x == closeList[j].x && pointU.y == closeList[j].y || flag == false){
        flag = false;
        break;
      }
    }
    for (var k in openList){
      if (pointU.x == openList[k].x && pointU.y == openList[k].y || flag == false){
        flag = false;
        break;
      }
    }
    if (flag)
      select.push(pointU);
  }
  if (mg[point.x][point.y+1] != 1){
    var pointD = new Point(point.x,point.y+1);
    var flag = true;
    for (var j in closeList){
      if (pointD.x == closeList[j].x && pointD.y == closeList[j].y || flag == false){
        flag = false;
        break;
      }
    }
    for (var k in openList){
      if (pointD.x == openList[k].x && pointD.y == openList[k].y || flag == false){
        flag = false;
        break;
      }
    }
    if (flag)
      select.push(pointD);
  }
  if (mg[point.x-1][point.y] != 1){
    var pointL = new Point(point.x-1,point.y);
    var flag = true;
    for (var j in closeList){
      if (pointL.x == closeList[j].x && pointL.y == closeList[j].y || flag == false){
        flag = false;
        break;
      }
    }
    for (var k in openList){
      if (pointL.x == openList[k].x && pointL.y == openList[k].y || flag == false){
        flag = false;
        break;
      }
    }
    if (flag)
      select.push(pointL);
  }
  if (mg[point.x+1][point.y] != 1){
    var pointR = new Point(point.x+1,point.y);
    var flag = true;
    for (var j in closeList){
      if (pointR.x == closeList[j].x && pointR.y == closeList[j].y || flag == false){
        flag = false;
        break;
      }
    }
    for (var k in openList){
      if (pointR.x == openList[k].x && pointR.y == openList[k].y || flag == false){
        flag = false;
        break;
      }
    }
    if (flag)
      select.push(pointR);
  }


  for (var i=0;i<select.length;i++){
    select[i].setPrePoint(point);
    select[i].calG();
    select[i].calH(endPoint);
    select[i].calF();
    openList.push(select[i]);
  }
  console.log("最终返回的select[]:");
  for (var i=0;i<select.length;i++){
    console.log(select[i].x+","+select[i].y);
  }
  return select;
}
