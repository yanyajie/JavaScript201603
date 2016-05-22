	function EventEmitter(){};//原理等同于EventTarget类
EventEmitter.prototype.on=function(type,fn){//约定、订阅
	if(!this["aEvent"+type]){
		this["aEvent"+type]=[]	
	}
	var a=this["aEvent"+type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return this;	
	}
	a.push(fn);
	return this;
	
}
EventEmitter.prototype.run=function(e,systemEvent){//通知、回调
	//e={type:"boiling",message:"boiling"} e这个参数是类似于这样的一个对象。这是第一个参数
	//第二个参数是指浏览器的事件对象，如有必要，还可以把浏览器的事件对象传进来
	var a=this["aEvent"+e.type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(typeof a[i]=="function"){
				a[i].call(this,e,systemEvent);
			}else{
				a.splice(i,1);
				i--;	
			}
		}
	}
}
EventEmitter.prototype.off=function(type,fn){//解除约定、解除订阅
	var a=this["aEvent"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;
				return this;	
			}
		}
	}
	return this;
}
	function Drag(ele){//类名、构造函数
	//构造函数是初始化的作用
		this.x=null;
		this.y=null;
		this.mx=null;
		this.my=null;
		
		this.ele=ele;
		this.DOWN=processThis(this.down,this);

		on(ele,"mousedown",this.DOWN);//这样处理，当事件触发的时候，执行的是this.DOWN,this.DOWN里的this是谁？this.down里的this为什么
		this.MOVE=processThis(this.move,this);
		this.UP=processThis(this.up,this);
	}
	Drag.prototype=new EventEmitter;
	Drag.prototype.down=function(e){
		this.x=this.ele.offsetLeft;
		this.y=this.ele.offsetTop;
		this.mx=e.pageX;
		this.my=e.pageY;
		if(this.ele.setCapture){
			this.ele.setCapture();
			on(this.ele,"mousemove",this.MOVE);
			//on(this.ele,"mousemove",this.move);
			//this.move();
			on(this.ele,"mouseup",this.UP);
		}else{
			on(document,"mousemove",this.MOVE);
			on(document,"mouseup",this.UP);
		}
		e.preventDefault();
		
		this.run({type:"dragstart"},e);
		
		
	};
	Drag.prototype.move=function(e){
		this.ele.style.left=this.x+e.pageX-this.mx+"px";
		this.ele.style.top=this.y+e.pageY-this.my+"px";
		this.run({type:"dragging"},e);//type是"dragging"相当于确定了事件类型 
	};
	Drag.prototype.up=function(e){
		if(this.ele.releaseCapture){
			this.ele.releaseCapture();
			off(this.ele,"mousemove",this.MOVE);
			off(this.ele,"mouseup",this.UP);	
		}else{
			off(document,"mousemove",this.MOVE);
			off(document,"mouseup",this.UP);
		}
		this.run({type:"dragend"},e);
	};
	
	///-----------升级原型方法
	
	Drag.prototype.range=function(oRange){
		//参数oRange就是这个拖拽的限定范围
		//oRange={l:0,r:500,t:0,b:300}
		this.range=oRange;
		this.on("dragging",this.addRange);//当拖拽进行的时候，执行这个addRange方法，这样addRange的运行结果就把move方法的运行结果给覆盖了
	}
	Drag.prototype.addRange=function(dragE,e){
		
		//这个方法才负责按oRange计算拖拽的范围
		var oRange=this.range;
		var l=this.x+e.pageX-this.mx;//计算拖拽水平坐标
		var t=this.y+e.pageY-this.my;//计算拖拽的垂直坐标
		if(l>=oRange.r){
			this.ele.style.left=oRange.r+"px"	
		}else if(l<=oRange.l){
			this.ele.style.left=oRange.l+"px";
		}else{
			this.ele.style.left=l+"px";
		}
		if(t>=oRange.b){
			this.ele.style.top=oRange.b+"px";
		}else if(t<=oRange.t){
			this.ele.style.top=oRange.t+"px";
		}else{
			this.ele.style.top=t+"px";
		}
		
	}
	
	Drag.prototype.border=function(){
		this.on("dragstart",this.addBorder);
		this.on("dragend",this.removeBorder);
	}
	
	Drag.prototype.addBorder=function(){
		this.ele.style.border="2px  dashed yellow";
	}
	Drag.prototype.removeBorder=function(){
		this.ele.style.border="none";
	}
	
	