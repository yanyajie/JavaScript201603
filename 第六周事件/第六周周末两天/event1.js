function on(ele,type,fn){
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
	/*
	var outArg=[].slice.call(arguments,2);
	return function(e){
		var innerArg=[].slice.call(arguments,0);
		//fn.call(context,e);
		fn.apply(context,innerArg.concat(outArg));
	}
	*/
	return function(e){
		fn.call(context,e);
	}
		
	
}


