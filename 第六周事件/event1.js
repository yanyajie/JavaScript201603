function on(ele,type,fn){
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;	
	}
	if(!ele["aEvent"+type]){
		ele["aEvent"+type]=[];	
		//只有这个判断里，才能实现相当的事件类型下，run方法只被绑定一次（确保run方法不会被重复绑定）
		ele.attachEvent("on"+type,function(){run.call(ele)});
	}
	
	var a=ele["aEvent"+type];
	for(var i=0;i<a.length;i++){
		if(a[i]==fn)return;
	}
	a.push(fn);	
}
function run(){
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



