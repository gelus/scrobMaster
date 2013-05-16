ScrobMaster
====
Master your scroll events based on the elements you are affecting.<br />
ScrobMaster allows you to attach events to scroll points based off registered DOM elements.

<h3>Overview:</h3>
ScrobMaster works with elements that have been registered to create "Scrobjects". 
Each Scrobject has two adjustable zones that each have three attachable events. 
Events are executed when the page's settable trigger point enters, exits or scrolls in one of the scrobjects zones.
<pre>
	events: bufferEnter, bufferStep, bufferExit, enter, step, exit
	
	Buffer Zone: the space between bufferTop and bufferBottom
	live Zone: the space between top and bottom
	
	         Window
	------------------------
	|  ....................|....... bufferTop
	|  .                   |
	|  .                   |        Buffer Zone
	|  .                   |
	|  ------------------..|....... top
	|  |     Element    |  |
	|  |                |  |        live Zone
	|  |                |  |
	|  ------------------..|....... bottom
	|  .                   |
	|  ....................|....... bufferBottom
	------------------------
	
</pre>

<h5>Basic Use:</h5>
<pre>
		//Basic Example: 
		// Register Element with ID of bob2 as a scrobject
		scrob.register('bob2');
		
		//set the bufferEnter event to trigger 100px above the element
		scrob.bob2.set("bufferTop", -100);

		// Set the enter event to change the background color
		// based on the direction of the scroll when event it triggered.
		scrob.bob2.on('enter', function(scrollState){
			this.style.backgroundColor = (scrollState.direction == "up")? "red":"blue";
		});

		// Set exit event to revert the background color to white.
		scrob.bob2.on('exit', function(scrollState){
			this.style.backgroundColor = "white";
		});
</pre>
For ease of use ScrobMaster methods can be chained and most accept objects to attach multiple events and set multiple properties at once. So the above could be reduced to:
<pre>
		scrob.register('bob2').set({
			'bufferTop': -100,
			'enter': function(scrollState){this.style.backgroundColor = (scrollState.direction == "up")? "red":"blue";},
			'exit': function(scrollState){this.style.backgroundColor = "white";}
		});
</pre>
Please note: In the examples above to raise the bufferEnter's trigger point a negative value was used. This is because ScrobMaster positioning is based off scrollTop, Larger numbers are further down on the page and the opposite for smaller. The top of the page being located at 0.
<hr>
<h3>ScrobMaster API</h3>
<h5>Register</h5>
<pre>
	scrob.register("elementID");
	scrob.register("#elementID");
	scrob.register(".className");
</pre>
Registers and returns a new Scrobject on the scrobMaster.
Registered elements are accessible off the scrobMaster via the ID passed into the register method.
Chain-able.
<pre>
	//Register example:
	scrob.register('bob2');
	//returns scrob.bob2
	
	//access a scrobject:
	scrob.bob2 || scrob['bob2']

</pre>

<h5>setTriggerPos</h5>
<pre>scrob.setTriggerPos(int);</pre>
Sets the windows trigger position.
Defaults to 0 or the top of the window.
Chain-able Returns ScrobMaster or Scrobject it was called on.

<h5>getScrollTop</h5>
<pre>scrob.getScrollTop()</pre>
Not Chain-able.
Returns the current scroll position of the window.
<hr>
<h3>ScrobJect API</h3>
Methods outlined below are called off a registered scrobject, eg. scrob.bob2.methodCall();

<h5>set</h5>
<pre>
	scrob.bob2.set(property[, val])
	scrob.bob2.set({"property":val });
</pre>

set properties and or events for your scrobject.<br />
accepts object with prop:val pairs<br />
Chain-able, returns scrobject called on.<br />

Settable properties:
<ul>
	<li>elm : DOM element - element events will affect.</li>
	<li>top: integer  - top trigger point relative to elm</li>
	<li>bottom: integer  - bottom trigger point relative to elm</li>
	<li>bufferTop: integer  - top trigger of buffer point relative to elm</li>
	<li>bufferBottom: integer  - bottom trigger of buffer point relative to elm</li>
</ul>

Note - if top is set to a value less than bufferTop; bufferTop will also be set to the given value. The reverse is true for bottom and bufferBottom

Attachable methods:
<ul>
	 <li>bufferEnter - triggered when buffer zone is entered from top or bottom</li>
	 <li>bufferStep - triggered on scroll in buffer zone</li>
	 <li>bufferExit -  triggered when buffer zone is exited from top or bottom</li>
	 <li>enter - triggered when live zone is entered from top or bottom</li>
	 <li>step - Triggered on scroll in live zone</li>
	 <li>exit - triggered when live zone is exited from top or bottom</li>
</ul>
Event method functions accept the current ScobMaster scrollState, described below, as their only parameter

<h5>on</h5>
<pre>
	scrob.bob2.on(method[, val])
	scrob.bob2.on({"method":val})
</pre>
Syntactical alias for set - Used to assign scroll events<br />
accepts object with prop:val pairs<br />
Chain-able, returns scrobject called on.
<h5>addon</h5>
<pre>
	scrob.bob2.addon(method[, val])
	scrob.bob2.addon({"method":val})
</pre>
Similar to the "on" method, used to assign scroll events in addition to previously defined handles rather than replace them.<br />
accepts objects with prop:val pairs<br />
Chain-able, returns scrobject called on.<br />
example
<pre>
	scrob.register('bob2');
	scrob.on('enter', function(scrollState){console.log('one')});
	scrob.addon('enter', function(scrollState){console.log('two')});
	//Will log both 'one' and 'two' when enter is triggered
</pre>

<h5>elm</h5>
<pre>scrob.bob2.elm</pre>
The element that the scrobject affects

<h5>style</h5>
<pre>scrob.bob2.style</pre>
Shorthand to the affected elements style attribute.

<hr>
<h3>Inside the event handler function</h3>
Here is some information about the handles you pass when setting events:
<h5>ScrobMaster scrollState argument</h5>
scrollState is updated on scroll and passed in to each event method defined when trigged. 
Property
<ul>
	<li>scrollState.direction = direction of scroll.</li>
	<li>scrollState.scrollTop = current scrollTop of window</li>
	<li>scrollState.lastScrollTop = previous scrollTop of window.</li>
</ul>

<h5>this</h5>
Inside of a handler function "this" refers to the scrobject you are affecting.
<pre>
	//an example:

	scrob.bob2.set({
		'enter': function(state){
			this.on('exit', function(state){this.style.border = "none"}),
			this.style.border = "solid 2px red";
		}
	});

</pre>
<hr>
<h3>Working with Classes and ScrobMaster</h3>
<p>ScrobMaster supports registering a group of elements at the same time through the use of a CSS class selector.<br />
Registering with a class selector will return a scrobarray object; The same way a scrobject would be returned. <br />
The scrobarray object has the same methods and properties as the basic scrobject. The difference is, rather than applying them to a single element, a scrobarray houses an array of nodes. (scrob.scrobarray.nodes) These nodes are essentially scrobject that prototype thier parental scrobarray.</p>
<p>Each node has the ability to support it's own set of handles that will overide the scrobarray handles.<br />Scrobarray nodes are only available to edit after the DOM has loaded.</p>



example:
<pre>
	
	scrob.register('.classBob');
	
	scrob.classBob.set({
		"enter": function(state){this.style.backgroundColor = "blue"}, 
		"exit": function(state){this.style.backgroundColor = "white"}, 
		"top": -100 
	});
	
	window.onload = function(){
		scrob.classBob.nodes[1].set("enter", funciton(state){this.style.backgroundColor = "green"});
	}
	
</pre>
What we did:<br />
<ul>
<li>register the className, which will construct and return a new scrobarray.</li>
<li>set the enter, exit events and trigger top for every node on the scrobarray, which will, again, return the scrobarray
<ul>
<li>turn blue when element is entered</li>
<li>turn white when element is exited</li>
<li>set trigger point to be 100px above each element</li>
<ul>
</li>
<li>change the enter event for the second node after it is available for editing (after the DOM loads)</li>
<ul>
<li>This will overwrite the previously set enter event for THIS NODE ONLY.</li>
<li>All others will function as previously defined</li>
<li>returns the ScrobArrayNode that was called upon.</li>
</ul>
</ul>
