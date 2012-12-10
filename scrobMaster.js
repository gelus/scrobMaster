/******* ScrobMaster *******/
/* ---- 
	Author: Benjamin Miller (www.htmlben.com)
	Version 0.0.1
*/
(function(){
	function scrobMasterProto(){
		this.triggerPos = 0;
		this.state = {},
		this.execute = function(funcs, key){
			if(Object.prototype.toString.call(funcs) == "[object Array]"){
				for(var i = 0, len = funcs.length; i<len; i++){
					scrob[key].executing = funcs[i];
					scrob[key].executing(scrob.state);
				}
				delete scrob[key].executing;
				return
			}
			scrob[key].executing = funcs;
			scrob[key].executing(this.state);
			delete scrob[key].executing;
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
		},
		this.register = function(elmID){
				var self = scrob;
				self[elmID] = new scrobject(elmID);
				if(document.getElementById(elmID))self[elmID].initiate(elmID);
				else{
					try{window.addEventListener('load', function(){self[elmID].initiate(elmID);}, false)}
					catch(err){window.attachEvent('onload', function(){self[elmID].initiate(elmID);})}
				}

				return self[elmID];
		}
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
		this.initiate = function(elmID){
			var elm = (elmID)? document.getElementById(elmID):this.elm;
			console.log(elm);
			var ob = this;
			ob.absoluteTop = (ob.absoluteTop)? ob.absoluteTop:elm.offsetTop;
			ob.absoluteBottom = (ob.absoluteBottom)? ob.absoluteBottom:elm.offsetTop+elm.offsetHeight;
			ob.top = (ob.top)? ob.top:0;
			ob.bottom = (ob.bottom)? ob.bottom:0;
			ob.bufferTop = (ob.bufferTop)? ob.bufferTop:0;
			ob.bufferBottom = (ob.bufferBottom)? ob.bufferBottom:0;
			ob.elm = elm;
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
		this.on = function(prop, val){return this.set(prop, val)}
		this.set = function(prop, val){
			if(typeof prop == "string"){
				this.assign(prop, val);
				return this;
			}
			for(var key in prop){
				if(prop.hasOwnProperty(key))this.assign(key, prop[key]);
				}
			return this;
		},
		this.assign = function(prop, val){
			this[prop] = val;
			if(prop == "top" && (!this.bufferTop || val<this.bufferTop))this.bufferTop = val;
			if(prop == "bottom" && (!this.bufferBottom || val>this.bufferBottom))this.bufferBottom = val;
		}
	}
	scrobjectProto.prototype = new scrobMasterProto();

	function scrobject(elmID){}
	scrobject.prototype = new scrobjectProto();

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
			if(scrob.hasOwnProperty(key) && scrob[key] instanceof scrobject){
				if(scrob[key].resolvedBufferTop() < trigger && scrob[key].resolvedBufferBottom() > trigger){
					if(!scrob[key].bufferEnetered){
						if(scrob[key].bufferEnter)scrob.execute(scrob[key].bufferEnter, key);//Buffer Enter Event
						scrob[key].bufferEnetered = true;
					}
					if(scrob[key].bufferStep)scrob.execute(scrob[key].bufferStep, key);//Buffer Step Event
					if(scrob[key].resolvedTop() < trigger && scrob[key].resolvedBottom() > trigger){
						if(!scrob[key].entered){
							if(scrob[key].enter){scrob.execute(scrob[key].enter, key)}//scrob[key].enter();// Enter Event
							scrob[key].entered = true;
						}
						if(scrob[key].step)scrob.execute(scrob[key].step, key);//Step Event
					}else if(scrob[key].entered){
						if(scrob[key].exit)scrob.execute(scrob[key].exit, key);//Exit Event
						delete scrob[key].entered;
					}//close live zone
				}else if(scrob[key].bufferEnetered){
					if(scrob[key].entered){if(scrob[key].exit)scrob.execute(scrob[key].exit, key);//Exit Event
						delete scrob[key].entered;
					}
					if(scrob[key].bufferExit)scrob.execute(scrob[key].bufferExit, key);// Buffer Exit Event
					delete scrob[key].bufferEnetered;
				}//close buffer zone
			}
		}
	};
	try{
		window.addEventListener('scroll', updateScrollState, false);
		window.addEventListener('scroll', scrollevent, false);
	}
	catch(err){
		window.attachEvent('onscroll', scrollevent);
		window.attachEvent('onscroll', updateScrollState);
	}
})();