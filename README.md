ScrobMaster
====
Master your scroll events based on the elements you are affecting.<br />
ScrobMaster allows you to attach events to scroll points based off registered DOM elements.

<h3>Overview:</h3>
ScrobMaster works with elements that have been registered with ScrobMaster to create "Scrobjects". Each Scrobject has six adjustible trigger points that you can attach events to be executed when scrolled over.
<pre>
	attachable events: bufferEnter, bufferStep, bufferExit, enter, step, exit
	
	         Window
	------------------------
	|  ....................|....... bufferEnter
	|  .                   |
	|  .                   |        bufferStep is triggered for every scroll
	|  .                   |        in between bufferEnter and bufferExit
	|  .                   |
	|  ------------------..|....... enter
	|  |     Elmenet    |  |
	|  |                |  |        step is triggered for every scroll
	|  |                |  |        in between enter and exit
	|  |                |  |
	|  ------------------..|....... exit
	|  .                   |
	|  ....................|....... bufferExit
	------------------------
</pre>

<h5>Basic Use:</h5>
<pre>
	<script src="scrobMaster.js"></script>
	<script>
		//Basic Example: 
		// Register Element with ID of bob2 as a scrobject
		scrob.register('bob2');
		
		//set the bufferEnter event to trigger 100px above the element
		scrob.bob2.set("bufferTop", -100);

		// Set the enter event to change the background color
		// based on the direction of the scroll when event it triggered.
		scrob.bob2.on('enter', function(scrollState){
			this.elm.style.backgroundColor = (scrollState.direction == "up")? "red":"blue";
		});

		// Set exit event to revert the background color to white.
		scrob.bob2.on('exit', function(scrollState){
			this.elm.style.backgroundColor = "white";
		});
	</script>
</pre>
For ease of use ScrobMaster methodes can be chained and most accept objects to attach multiple events and set multiple properties at once. So the above could be reduced to:
<pre>
	<script src="scrobMaster.js"></script>
	<script>
		scrob.register('bob2').set({
			'bufferTop': -100,
			'enter': function(scrollState){this.elm.style.backgroundColor = (scrollState.direction == "up")? "red":"blue";},
			'exit': function(scrollState){this.elm.style.backgroundColor = "white";}
		});
	</script>
</pre>
Please note: In the examples above to raise the bufferEnter's trigger point a negative value was used. This is because ScrobMaster positioning is bassed off scrollTop, Larger numbers are further down on the page and the oposite for smaller. The top of the page being located at 0.
<h3>ScrobMaster API</h3>
<h5>Register</h5>
<pre>scrob.register("elementID");</pre>
Registers and returns a new Scrobject on the scrobMaster.
Registered elements are accessible off the scrobMaster via the ID passed into the register methode.
Chainable.
<pre>
	//Register example:
	scrob.register('bob2');
	//returns scrob.bob2
	/access a scrobject:
	scrob.bob2 || scrob['bob2']

</pre>

<h5>setTriggerPos</h5>
<pre>scrob.setTriggerPos(int);</pre>
Sets the windows trigger position.
Defaults to 0. Returns ScrobMaster or Scrobject it was called on.

<h5>getScrollTop</h5>
<pre>scrob.getScrollTop</pre>
Not Chainable.
Returns the current scroll position of the window.

<h3>ScrobJect API</h3>
Methods outlined below are called off a registered scrobject, eg. scrob.bob2.methodeCall();

<h5>set</h5>
<pre>scrob.bob2.set(property[, val])</pre>

set properties and or events for your scrobject.<br />
accepts object with prop:val pairs<br />
Chainable, returns scrobject called on.<br />

Setable properties : expected val - description
<ul>
	<li>elm : DOM element - element events will affect.</li>
	<li>top: integer  - top trigger point relative to elm</li>
	<li>bottom: integer  - bottom trigger point relative to elm</li>
	<li>bufferTop: integer  - top trigger of buffer point relative to elm</li>
	<li>bufferBottom: integer  - bottom trigger of buffer point relative to elm</li>
</ul>

Note - if top is set to a value less than bufferTop; bufferTop will also be set to the given value. The reverse is true for bottom and bufferBottom

Attachable methodes - description, expects functions
<ul>
	 <li>bufferEnter - triggered when buffer zone is entered from top or bottom</li>
	 <li>bufferStep - triggered on scroll in buffer zone</li>
	 <li>bufferExit -  triggered when buffer zone is exited from top or bottom</li>
	 <li>enter - triggered when live zone is entered from top or bottom</li>
	 <li>step - Triggered on scroll in live zone</li>
	 <li>exit - triggered when live zone is exited from top or bottom</li>
</ul>
Event methode functions accept the current ScobMaster scrollState, described below, as their only parameter

<h5>on</h5>
<pre>scrob.bob2.on(methode[, val])</pre>
Syntactical alias for set - Used to assign scoll events<br />
Chainable, returns scrobject called on.
<h5>addon</h5>
<pre>scrob.bob2.addon(methode[, val])</pre>
Similar to the "on" methode, used to assign scroll events in addtion to previously defined handles rather than replace them.<br />
Chainable, returns scrobject called on.<br />
example
<pre>
	scrob.register('bob2');
	scrob.on('enter', function(scrollState){console.log('one')});
	scrob.addon('enter', function(scrollState){console.log('two')});
	//Will log both 'one' and 'two' when enter is triggered
</pre>

<h3>ScrobMaster scrollState</h3>
scrollState is updated on scroll and passed in to each event methode defined when triggerd. 
Properties:
<ul>
	scrollState.direction = direction of scroll.
	scrollState.scrollTop = current scrollTop of window
	scrollState.lastScrollTop = previous scrollTop of window.
</ul>