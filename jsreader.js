			//TODO: move to external js file
/*
Thank you https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/.
templates: https://www.w3schools.com/TagS/tag_template.asp

var feeds = new JSReader({
    containingElement: 'body'
});

*/
(function () {

	this.JSReader = function(){
		// TODO: move urls to local storage
		var defaults = {
	      containingElement: 'body',
	      itemTemplate: '<article><h3><a href="" target="_blank" rel="noopener"></a></h3><p></p></article>',
	      rssUrls: ['https://codepen.io/picks/feed/','https://www.sans.org/tip-of-the-day/rss']
	    }

	    if (arguments[0] && typeof arguments[0] === "object") {
	    	this.options = extendDefaults(defaults, arguments[0]);
	    }

	    fetchfeeds();
	}

	JSReader.prototype.open = function() {
	// public code goes here
	}


	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
		  if (properties.hasOwnProperty(property)) {
		    source[property] = properties[property];
		  }
		}
		return source;
	}

	function fetchfeeds(){
		console.log(this);
		options.rssUrls.forEach(url => fetchfeed(`${url}`));
	}

	function fetchfeed(url){
		fetch(url)
			.then(response => response.text())
			.then(str => new window.DOMParser().parseFromString(str, "text/xml"))
			.then(data => {
				// TODO: use template for channel
				const items = data.querySelectorAll("item");
				items.forEach(el => {
					var title = `${el.querySelector('title').innerHTML}`;
					title = clean(title);

					var description = `${el.querySelector('description').innerHTML}`;
					description = clean(description);

					node = document.importNode(feeditemtemplate, true);
					node.querySelector('a').text = title;
					node.querySelector('a').href = `${el.querySelector('link').innerHTML}`;
					node.querySelector('p').innerHTML = description;
					document.body.appendChild(node);
				});
		 	});
	}

	function clean(str){
		return str.replace("<![CDATA[", "").replace("]]>", "");
	}

}());





