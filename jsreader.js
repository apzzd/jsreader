
/*
Thank you https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/.

refresher on building a plugin: https://scotch.io/tutorials/building-your-own-javascript-modal-plugin

var feeds = new JSReader({
    containerSelector: 'body'
});

//	      rssUrls: ['https://codepen.io/picks/feed/','https://www.sans.org/tip-of-the-day/rss']


*/
(function () {

	this.JSReader = function(){
		this.templates = {
			urlform: '<textarea id="rssUrls"></textarea>',
			channel: '<section><h2></h2></section>',
			item: '<article><h3><a target="_blank" rel="noopener"></a></h3><p></p></article>'
		}

		// TODO: move urls to local storage
		var defaults = {
	      containerSelector: 'body'
		}

	    if (arguments[0] && typeof arguments[0] === "object") {
	    	this.options = extendDefaults(defaults, arguments[0]);
	    }

	  	if (localStorage.getItem("JSReaderUrls") ){
			fetchfeeds(this);
	  	}

	  	jsreader = this;

		window.addEventListener("load", function(){
			addUrlForm(jsreader);
		});
	}

	// JSReader.prototype.open = function() {
	// // public code goes here
	// }


	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
		  if (properties.hasOwnProperty(property)) {
		    source[property] = properties[property];
		  }
		}
		return source;
	}

	function fetchfeeds(obj){
		rssUrls = localStorage.getItem("JSReaderUrls").split("\n");
		// TODO clean this list: trim, and throw out empty strings
		rssUrls.forEach(url => fetchfeed(obj, `${url}`));			
	}

	function fetchfeed(obj, url){
		fetch(url)
			.then(response => response.text())
			.then(str => new window.DOMParser().parseFromString(str, "text/xml"))
			.then(data => {
// TODO: check for injection of malcious content

				channeltemplate = document.createElement('template');
				channeltemplate.innerHTML = obj.templates.channel;
				channelnode = document.importNode(channeltemplate.content, true);
				console.log(data);
				channelnode.querySelector('h2').innerHTML = clean(data.querySelector("channel title").innerHTML);

				const items = data.querySelectorAll("item");
				items.forEach(el => {
					var template = document.createElement('template');
					template.innerHTML = obj.templates.item;

					node = document.importNode(template.content, true);
					node.querySelector('a').text = clean(el.querySelector('title').innerHTML);
					node.querySelector('a').href = el.querySelector('link').innerHTML;
					node.querySelector('p').innerHTML = clean(el.querySelector('description').innerHTML);
					channelnode.querySelector('section').appendChild(node);
				});

				document.querySelector(obj.options.containerSelector).appendChild(channelnode);

				return obj;
		 	});
	}

	function clean(str){
		return str.replace("<![CDATA[", "").replace("]]>", "");
	}

	function addUrlForm(obj){
		template = document.createElement('template');
		template.innerHTML = obj.templates.urlform;

		node = document.importNode(template.content, true);
		node.querySelector('textarea').value = localStorage.getItem("JSReaderUrls");			
		node.querySelector('textarea').addEventListener('blur',function(){
			localStorage.setItem("JSReaderUrls", this.value);
		});
		document.querySelector(obj.options.containerSelector).parentElement.appendChild(node);
	}

}());





