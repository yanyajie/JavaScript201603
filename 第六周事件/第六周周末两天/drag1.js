function down(e){//拖拽开始，或准备拖拽
	this.x=this.offsetLeft;
	this.y=this.offsetTop;
	this.mx=e.pageX;
	this.my=e.pageY;
	
	if(this.setCapture){
		this.setCapture();
		on(this,"mousemove",move);
		on(this,"mouseup",up);
	}else{
		//毛主席教导我们：只要是处理或改变this关键字的指向，一定不要忘记call或apply方法。
		this.MOVE=move.bind(this);
		this.UP=up.bind(this);
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	e.preventDefault();
}


function move(e){
	//当前盒子的位置=鼠标移动的距离+盒子原来的位置
	this.style.left=e.pageX-this.mx+this.x+"px";
	this.style.top=e.pageY-this.my+this.y+"px";
	
}

function up(e){
	if(this.releaseCapture){
		this.releaseCapture();
		off(this,"mousemove",move);
		off(this,"mouseup",up);
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);
	}
}