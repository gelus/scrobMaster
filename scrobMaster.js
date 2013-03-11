/******* ScrobMaster *******/
/* ---- 
	Author: Benjamin Miller (www.htmlben.com)
	Version 0.0.2
*/
(function(){
	function scrobMasterProto(){
		this.triggerPos = 0;
		this.state = {},
		this.execute = function(funcs, key){
			if(Object.prototype.toString.call(funcs) == "[object Array]"){
				for(var i = 0, len = funcs.length; i<len; i++){
					funcs[i].call(key, this.state);
				}
				return
			}
			funcs.call(key, this.state);
		}
		this.triggerPoint = function(){
			return this.getScrollTop() + this.triggerPos;
		}
		this.getScrollTop = function (){
			if(typeof pageYOffset != 'undefined')return pageYOffset;
	    else{
        var B = document.body; //IE 'quirks'
        var D = document.documentElement; //IE with doctype
        D = (D.clientHeight)? D: B;
        return D.scrollTop;
		   }
		};
		this.register = function(elmID){
				var self = scrob;
				if(elmID.substring(0,1)=="."){
					var targetClass = elmID.substring(1);
					self[targetClass] = new scrobarray();
					self[targetClass].initiate(targetClass);
					return self[targetClass];
				}

				if(elmID.substring(0,1)=="#"){
					elmID = elmID.substring(1);
				}
				self[elmID] = new scrobject(elmID);
				if(document.getElementById(elmID))self[elmID].initiate(elmID);
				else{
					try{window.addEventListener('load', function(){self[elmID].initiate(elmID);}, false)}
					catch(err){window.attachEvent('onload', function(){self[elmID].initiate(elmID);})}
				}

				return self[elmID];
		},
		this.setTriggerPos = function(val){
			scrob.triggerPos = val||0;
			return this;
		}
	}
	function scrobMaster(){}
	scrobMaster.prototype = new scrobMasterProto();

	function scrobjectProto(){
		this.resolvedBufferTop = function(){return this.absoluteTop+this.bufferTop};
		this.resolvedTop = function(){return this.absoluteTop+this.top};
		this.resolvedBottom = function(){return this.absoluteBottom+this.bottom};
		this.resolvedBufferBottom = function(){return this.absoluteBottom+this.bufferBottom};
		this.getAbsoluteTop = function(){
			var parent = this.elm.offsetParent,
					top = this.elm.offsetTop;
			while(parent !== document.body && parent !== document.getElementsByTagName('html')[0]){
				top += parent.offsetTop;
				parent = parent.offsetParent;
			}
			return top;
		};
		this.initiate = function(elmID){
			var elm = (typeof elmID == 'string')? document.getElementById(elmID):elmID;
			var ob = this;
			ob.elm = elm;
			ob.absoluteTop = (ob.absoluteTop)? ob.absoluteTop:ob.getAbsoluteTop();
			ob.absoluteBottom = (ob.absoluteBottom)? ob.absoluteBottom:ob.getAbsoluteTop()+elm.offsetHeight;
			ob.top = (ob.top)? ob.top:0;
			ob.bottom = (ob.bottom)? ob.bottom:0;
			ob.bufferTop = (ob.bufferTop)? ob.bufferTop:0;
			ob.bufferBottom = (ob.bufferBottom)? ob.bufferBottom:0;
			ob.style = elm.style;
		}
		this.addon = function(prop, val){
			if(typeof prop == "string"){
				if(this[prop]){
					if(Object.prototype.toString.call(this[prop]) != "[object Array]"){
						var holder = this[prop]
						this[prop] = [];
						this[prop].push(holder);
						this[prop].push(val);
						return this
					}
					this[prop].push(val);
					return this;
				}
				return this.set(prop, val);
			}

			for(var key in prop){
				if(prop.hasOwnProperty(key))this.addon(key, prop[key]);
			}
			return this
		}

		this.on = seter;
		this.set = seter;

		this.assign = function(prop, val){
			this[prop] = val;
			if(prop == "top" && (!this.bufferTop || val<this.bufferTop))this.bufferTop = val;
			if(prop == "bottom" && (!this.bufferBottom || val>this.bufferBottom))this.bufferBottom = val;
		}

		function seter(prop, val){
			if(typeof prop == "string"){
				this.assign(prop, val);
				return this;
			}
			for(var key in prop){
				if(prop.hasOwnProperty(key))this.assign(key, prop[key]);
				}
			return this;
		}
	}
	scrobjectProto.prototype = new scrobMasterProto();

	function scrobject(elmID){}
	scrobject.prototype = new scrobjectProto();

	function scrobarrayProto(){
		this.nodeInitiate = this.initiate;
		this.initiate = function(classString){
			

			var obar = this;
			this.nodes = classString;

			function ScrobArrayNode(){}
			ScrobArrayNode.prototype = obar;

			if(getClass(this.nodes) != undefined){gatherClasses()}
			else{
				if(window.addEventListener)window.addEventListener("load", gatherClasses, false);
				else window.attachEvent("onload", gatherClasses);
			}
			function gatherClasses(){				
				var  classHolder = getClass(obar.nodes);
				obar.nodes = [];
				for(var i = 0, len = classHolder.length; i<len; i++){
					obar.nodes.push(new ScrobArrayNode());
					obar.nodes[i].nodeInitiate(classHolder[i]);
				}
			}
		};
		function getClass(string){
			if(document.getElementsByClassName){
				var elms = document.getElementsByClassName(string);
				return (elms.length == 0)? undefined:elms;
			}
			var elms = document.getElementsByTagName('*')
				, match = new Array()
				, regex = new RegExp("(^|\\s)"+string+"($|\\s)");

			for(var i = 0, len = elms.length; i<len; i++){
				if(elms[i].className.match(regex)){
					match.push(elms[i]);
				}
			}
			return (match.length > 0)? match:undefined;
		}
	}
	scrobarrayProto.prototype = new scrobjectProto();
	function scrobarray(){}
	scrobarray.prototype = new scrobarrayProto();

	window.scrob = new scrobMaster();

	var updateScrollState = function(){
		var ss = scrob.state;
		ss.lastScrollTop = (ss.scrollTop)? ss.scrollTop:scrob.getScrollTop();
		ss.scrollTop = scrob.getScrollTop();
		ss.direction = (ss.scrollTop >= ss.lastScrollTop)? 'down':'up';
	}
	
	var scrollevent = function(){
		var trigger = scrob.triggerPoint();
		for(var key in scrob){
			if(scrob.hasOwnProperty(key)){
				if(scrob[key] instanceof scrobject){
					scrobCheck(scrob[key], trigger);
				}else if(scrob[key] instanceof scrobarray){
					for(var i = 0, len = scrob[key].nodes.length; i<len; i++){
						scrobCheck(scrob[key].nodes[i], trigger);
					}
				}
			}
		}
	};

	var scrobCheck = function(key, trigger){
		if(key.resolvedBufferTop() < trigger && key.resolvedBufferBottom() > trigger){
			if(!key.bufferEnetered){
				if(key.bufferEnter)scrob.execute(key.bufferEnter, key);//Buffer Enter Event
				key.bufferEnetered = true;
			}
			if(key.bufferStep)scrob.execute(key.bufferStep, key);//Buffer Step Event
			if(key.resolvedTop() < trigger && key.resolvedBottom() > trigger){
				if(!key.entered){
					if(key.enter){scrob.execute(key.enter, key)}//key.enter();// Enter Event
					key.entered = true;
				}
				if(key.step)scrob.execute(key.step, key);//Step Event
			}else if(key.entered){
				if(key.exit)scrob.execute(key.exit, key);//Exit Event
				delete key.entered;
			}//close live zone
		}else if(key.bufferEnetered){
			if(key.entered){if(key.exit)scrob.execute(key.exit, key);//Exit Event
				delete key.entered;
			}
			if(key.bufferExit)scrob.execute(key.bufferExit, key);// Buffer Exit Event
			delete key.bufferEnetered;
		}//close buffer zone
	}
	if(window.addEventListener){
		window.addEventListener('scroll', updateScrollState, false);
		window.addEventListener('scroll', scrollevent, false);
	}
	else{
		window.attachEvent('onscroll', scrollevent);
		window.attachEvent('onscroll', updateScrollState);
	}
})();