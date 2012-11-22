(function(){
	function scrobMasterProto(){
		this.triggerPos = 0;
		this.state = {}
		this.execute = function(funcs, key){
			if(Object.prototype.toString.call(funcs) == "[object Array]"){
				for(var i = 0, len = funcs.length; i<len; i++){
					scrob[key].executing = funcs[i];
					scrob[key].executing(this.state);
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
			if(typeof pageYOffset!= 'undefined')return pageYOffset;
	    else{
        var B= document.body; //IE 'quirks'
        var D= document.documentElement; //IE with doctype
        D= (D.clientHeight)? D: B;
        return D.scrollTop;
		   }
		},
		this.register = function(elmID){
			function scrobjectUnitConstructor(elmID){}
				scrobjectUnitConstructor.prototype = new scrobjectUnitProto();

				function init(ob, elmID){
					var elm = document.getElementById(elmID);
					ob.absoluteTop = (ob.absoluteTop)? ob.absoluteTop:elm.offsetTop;
					ob.absoluteBottom = (ob.absoluteBottom)? ob.absoluteBottom:elm.offsetTop+elm.offsetHeight;
					ob.top = (ob.top)? ob.top:0;
					ob.bottom = (ob.bottom)? ob.bottom:0;
					ob.bufferTop = (ob.bufferTop)? ob.bufferTop:0;
					ob.bufferBottom = (ob.bufferBottom)? ob.bufferBottom:0;
					ob.elm = elm;
				}
				var self = scrob;
				self[elmID] = new scrobjectUnitConstructor(elmID);
				if(document.getElementById(elmID))init(self[elmID], elmID);
				else{
					try{window.addEventListener('load', function(){init(self[elmID], elmID);}, false)}
					catch(err){window.attachEvent('onload', function(){init(self[elmID], elmID);})}
				}

				return self[elmID];
		}
	}
	function scrobMaster(){}
	scrobMaster.prototype = new scrobMasterProto();

	function scrobjectUnitProto(){
		this.resolvedBufferTop = function(){return this.absoluteTop+this.bufferTop};
		this.resolvedTop = function(){return this.absoluteTop+this.top};
		this.resolvedBottom = function(){return this.absoluteBottom+this.bottom};
		this.resolvedBufferBottom = function(){return this.absoluteBottom+this.bufferBottom};
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
				this[prop] = val;
				return this;
			}
			for(var key in prop){
				if(prop.hasOwnProperty(key))this[key] = prop[key];
				}
			return this;
		}
	}
	scrobjectUnitProto.prototype = new scrobMasterProto();
	window.scrob = new scrobMaster();
	
	var scrollevent = function(){
		var trigger = scrob.triggerPoint();
		for(var key in scrob){
			if(scrob.hasOwnProperty(key)){
				if(scrob[key].resolvedBufferTop() < trigger && scrob[key].resolvedBufferBottom() > trigger){
					if(!scrob[key].bufferEnetered){
						if(scrob[key].bufferEnter)scrob[key].bufferEnter();//Buffer Enter Event
						scrob[key].bufferEnetered = true;
					}
					if(scrob[key].bufferStep)scrob[key].bufferStep();//Buffer Step Event
					if(scrob[key].resolvedTop() < trigger && scrob[key].resolvedBottom() > trigger){
						if(!scrob[key].entered){
							if(scrob[key].enter){scrob.execute(scrob[key].enter, key)}//scrob[key].enter();// Enter Event
							scrob[key].entered = true;
						}
						if(scrob[key].step)scrob[key].step();//Step Event
					}else if(scrob[key].entered){
						if(scrob[key].exit)scrob[key].exit();//Exit Event
						delete scrob[key].entered;
					}//close live zone
				}else if(scrob[key].bufferEnetered){
					if(scrob[key].entered){if(scrob[key].exit)scrob[key].exit();//Exit Event
						delete scrob[key].entered;
					}
					if(scrob[key].bufferExit)scrob[key].bufferExit();// Buffer Exit Event
					delete scrob[key].bufferEnetered;
				}//close buffer zone
			}
		}
	};
	try{window.addEventListener('scroll', scrollevent, false);}
	catch(err){window.attachEvent('onscroll', scrollevent)}
})();