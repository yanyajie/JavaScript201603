function EventEmitter(){}
EventEmitter.prototype.on=function(type,fn){
	if(!this["emitter"+type]){
		this["emitter"+type]=[];	
	}
	var a=this["emitter"+type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return this;//为了实现链式写法
	}
	a.push(fn);
	
	return this;//为了实现链式写法
}
EventEmitter.prototype.fire=function(type,e){
	var a=this["emitter"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
					a[i].call(this,e);
			}else{
				a.splice(i,1);
				i--;	
			}
		}
	}
}
EventEmitter.prototype.off=function(type,fn){
	var a=this["emitter"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;
				return this;//为了实现链式写法
			}
		}
	}	
	return this;//为了实现链式写法
}

function Drag(ele){//被拖拽的元素
	//this就不再是被拖拽的元素了，是当前类的实例
	this.x=null;
	this.y=null;
	this.mx=null;
	this.my=null;
	this.ele=ele;
	
	
	this.DOWN=processThis(this.down,this);
	this.MOVE=processThis(this.move,this);
	this.UP=processThis(this.up,this);
	on(this.ele,"mousedown",this.DOWN);
	//一定要注意：this.down，是通过this找到down方法，这和执行的时候没有关系，只是找到了一个方法定义的一个地址
}
Drag.prototype=new EventEmitter;
//Drag.prototype.__proto__=EventEmitter.prototype;
Drag.prototype.down=function(e){
	this.x=this.ele.offsetLeft;
	this.y=this.ele.offsetTop;
	this.mx=e.pageX;
	this.my=e.pageY;
	
	if(this.ele.setCapture){
		this.ele.setCapture();
		on(this.ele,"mousemove",this.MOVE);
		on(this.ele,"mouseup",this.UP);
	}else{
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);	
	}
	e.preventDefault();
	
	//Drag.prototype.fire();
	//new Drag.fire();
	this.fire("dragstart",e);//写这一行代码的人，是生产者。
	//"dragstart"它不是DOM元素的事件，而是自定义的Drag类的事件，所以这个事件类型不存在和DOM元素事件冲突的可能
	//但是:写obj.on("dragstart",clearEffect);使用者
}
Drag.prototype.move=function(e){
	this.ele.style.left=e.pageX-this.mx+this.x+"px";
	this.ele.style.top=e.pageY-this.my+this.y+"px";
	
	this.fire("dragging",e);
	
}
Drag.prototype.up=function(e){
	if(this.ele.releaseCapture){
		this.ele.releaseCapture();
		off(this.ele,"mousemove",this.MOVE);
		off(this.ele,"mouseup",this.UP);
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);
	}
	
	this.fire("dragend",e);
}

Drag.prototype.addRange=function(obj){//这个方法是让用户使用的，用户传进一个参数，这个参数是拖拽的范围
	this.oRange=obj;//把这个范围保存到实例的属性oRange上，便于range方法判断计算
	//var obj={left:0,right:0,top:0,bottom:1000};
	//什么时候计算被拖拽元素的位置：move方法计算，但是不能修改move方法，需要用事件接口实现重新计算拖拽的位置.
	//我们现在可以在不修改原来版本的前提下，实现对产品的升级，借助设计和原型方法来实现的
	this.on("dragging",this.range);//在move的时候执行this.range，这样可以在不修改move的代码的前提下，扩展完善move的功能
	
}
Drag.prototype.range=function(e){
	if(this.ele.offsetLeft<=this.oRange.left){
		this.ele.style.left=this.oRange.left+"px";	
	}else if(this.ele.offsetLeft>=this.oRange.right){
		this.ele.style.left=this.oRange.right+"px";
	}
	
	if(this.ele.offsetTop<=this.oRange.top){
		this.ele.style.top=this.oRange.top+"px";	
	}else if(this.ele.offsetTop>=this.oRange.bottom){
		this.ele.style.top=this.oRange.bottom+"px";	
	}
}

Drag.prototype.border=function(){
	this.on("dragstart",this.addBorder);
	this.on("dragend",this.removeBorder);
}
Drag.prototype.addBorder=function(){
	this.ele.style.border="3px dashed blue";	
}
Drag.prototype.removeBorder=function(){
	this.ele.style.border="none";
}

