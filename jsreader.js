
/*
Thank you https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/.

refresher on building a plugin: https://scotch.io/tutorials/building-your-own-javascript-modal-plugin

var feeds = new JSReader({
    containerSelector: 'body'
});

*/
(function () {

	this.JSReader = function(){
		// TODO: move urls to local storage
		var defaults = {
	      containerSelector: 'body',
	      channelTemplate: '<section><h2></h2></section>',
	      itemTemplate: '<article><h3><a target="_blank" rel="noopener"></a></h3><p></p></article>',
	      rssUrls: ['https://codepen.io/picks/feed/','https://www.sans.org/tip-of-the-day/rss']
	    }

	    if (arguments[0] && typeof arguments[0] === "object") {
	    	this.options = extendDefaults(defaults, arguments[0]);
	    }

	    fetchfeeds(this);
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
		obj.options.rssUrls.forEach(url => fetchfeed(obj, `${url}`));
	}

	function fetchfeed(obj, url){
		fetch(url)
			.then(response => response.text())
			.then(str => new window.DOMParser().parseFromString(str, "text/xml"))
			.then(data => {
// TODO: check for injection of malcious content

				channeltemplate = document.createElement('template');
				channeltemplate.innerHTML = obj.options.channelTemplate;
				channelnode = document.importNode(channeltemplate.content, true);
				channelnode.querySelector('h2').innerHTML = clean(data.querySelector("channel title").innerHTML);

				const items = data.querySelectorAll("item");
				items.forEach(el => {
					var template = document.createElement('template');
					template.innerHTML = obj.options.itemTemplate;

					node = document.importNode(template.content, true);
					node.querySelector('a').text = clean(el.querySelector('title').innerHTML);
					node.querySelector('a').href = el.querySelector('link').innerHTML;
					node.querySelector('p').innerHTML = clean(el.querySelector('description').innerHTML);
					channelnode.querySelector('section').appendChild(node);
				});

				document.querySelector(obj.options.containerSelector).appendChild(channelnode);
		 	});
	}

	function clean(str){
		return str.replace("<![CDATA[", "").replace("]]>", "");
	}

}());





