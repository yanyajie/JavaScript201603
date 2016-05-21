function on(ele,type,fn){
	//系统事件和自定义事件是有区别的，在事件类型（就是那个标识符字符串）上要和系统事件区分开，我们给自定义事件的原则是：都以self开头，这样就可以识别出那些是自定义事件，给自定义事件使用不同的程序池
	if(/^self/.test(type)){
		if(!ele["aSelf"+type]){
			ele["aSelf"+type]=[];	
		}
		var a=ele["aSelf"+type];
		for(var i=0;i<a.length;i++){
			if(a[i]==fn)return;	
		}
		a.push(fn);
	}
	
	
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;	
	}
	
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];	
		ele.attachEvent("on"+type,function(){fire.apply(ele)});
	}
	var a=ele["aEvent"+type];
	
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;	
	}
	a.push(fn);
		
}

function fire(){
	var e=window.event;
	var type=e.type;
	var a=this["aEvent"+type];
	if(!e.target){
		e.target=e.srcElement;
		e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
		e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
		e.stopPropagation=function(){e.cancelBubble=true;}
		e.preventDefault=function(){e.returnValue=false;}
		
	}
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

//给自定义事件写一个发布“通知”的方法
//这个方法什么时候用，用在那儿？
//这个方法的执行，是依赖于一个主体行为的。并且这个方法单独执行没有任何意义
function selfFire(selfType,e){//selfType是自定义的事件类型，就是那个字符串标识。e是系统的事件对象，因为有时候绑定在自定义事件上的方法，需要系统事件对象，比如需要鼠标坐标、键盘的编码等……，这样就可以让绑定在自定义事件上的方法，也可以使用系统事件对象了
	var a=this["aSelf"+selfType];
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


function off(ele,type,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);
		return;	
	}
	var a=ele["aEvent"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;	
			}
		}
	}
	
}
//fn在运行的时候，功能不变，但是this强制指向context
function processThis(fn,context){
	return function(e){
		fn.call(context,e);
	}
		
	
}


