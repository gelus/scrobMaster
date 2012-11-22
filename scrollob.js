(function(){
	function scrobjectConstructorProto(){
		this.triggerPos = 0;
		this.triggerPoint = function(){
			function getScrollTop(){
				if(typeof pageYOffset!= 'undefined')return pageYOffset;
		    else{
	        var B= document.body; //IE 'quirks'
	        var D= document.documentElement; //IE with doctype
	        D= (D.clientHeight)? D: B;
	        return D.scrollTop;
		    }
			}
			return getScrollTop() + this.triggerPos;
		}
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
				}
				var self = scrob;
				self[elmID] = new scrobjectUnitConstructor(elmID);
				if(document.getElementById(elmID))init(self[elmID], elmID);
				else{window.addEventListener('load', function(){init(self[elmID], elmID);}, false)}

				return self[elmID];
		}
	}
	function scrobjectConstructor(){}
	scrobjectConstructor.prototype = new scrobjectConstructorProto();

	function scrobjectUnitProto(){
		this.resolvedBufferTop = function(){return this.absoluteTop+this.bufferTop};
		this.resolvedTop = function(){return this.absoluteTop+this.top};
		this.resolvedBottom = function(){return this.absoluteBottom+this.bottom};
		this.resolvedBufferBottom = function(){return this.absoluteBottom+this.bufferBottom};
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
	scrobjectUnitProto.prototype = new scrobjectConstructorProto();
	window.scrob = new scrobjectConstructor();
	
	window.addEventListener('scroll', function(){
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
							if(scrob[key].enter)scrob[key].enter();// Enter Event
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
	});
})();



scrob.register('bob2').on({
	'enter': function(scrob){console.log('--- entered live zone\n\n')},
	'exit': function(scrob){console.log('--- exited live zone\n\n')},
	'step': function(scrob){console.log('step')},
	'bufferEnter': function(scrob){console.log('--- Entered buffer zone\n\n')},
	'bufferExit': function(scrob){console.log('--- Exit buffer zone\n\n')},
	'bufferStep': function(scrob){console.log('bufferStep')},
	'bufferTop': -200,
	'bufferBottom': 200
}).register('bob1').on({
	'step': function(scrob){console.log('ob one step bitch!')},
	'exit': function(scrob){console.log('I\'m sorry, I didn\'t mean to swear at you.')}
});