function on(ele,type,fn){
	if(/^self/.test(type)){//判断是否是自定义事件
		if(!ele["aSelf"+type]){//判断相应的事件池是否存在
			ele["aSelf"+type]=[];
		}
		var a=ele["aSelf"+type];
		//下面的循环是为避免重复绑定
		for(var i=0;i<a.length;i++){
			if(a[i]==fn)return;
		}
		a.push(fn);//保存到程序池
		return;	
	}
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;	
	}
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];	
		
		ele.attachEvent("on"+type,function(){run.call(ele)});
		//所谓的事件，就是把一件事发布了（公开了），一件事就是指一个function
		//自定义事件里，run的作用是通知，发布：
	}
	
	var a=ele["aEvent"+type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;
	}
	a.push(fn);	
}
function run(){//处理IE的系统事件的
	var e=window.event;
	var type=e.type;
	if(!e.target){
		e.target=e.srcElement;
		e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
		e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
		e.preventDefault=function(){e.returnValue=false;}
		e.stopPropagation=function(){e.cancelBubble=true;}
	}
	var a=this["aEvent"+type];
	if(a&&a.length){//判断这是个数组并且是个有内容（长度）的数组
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

function selfRun(selfType,e){//解决自定义事件的通知功能。第一个参数是自定义的事件类型，第二个参数e是浏览器的事件对象
	var a=this["aSelf"+selfType];
	
	for(var i=0;i<a.length;i++){
		if(typeof a[i]=="function"){
			a[i].call(this,e);	
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
				a[i]=null;//防止数组塌陷
				
			}
		}
	}
}

function processThis(fn,obj){
	/*
		此方法会返回一个新的方法：这个新方法的作用是无论fn在什么情况下执行，this都会无条件的指向obj
		这个方法相当于H5中的Function.prototype.bind
		
	*/
	return function(e){fn.call(obj,e);}
	
}



