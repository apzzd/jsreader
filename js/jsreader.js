(function () {

	this.JSReader = function(){
		this.templates = {
			urlform: '<div><h2>My Feeds</h2><p>Add one feed URL per line.</p><textarea id="rssUrls"></textarea></div>',
			channel: '<section><h2></h2></section>',
			item: '<article><h3><a target="_blank" rel="noopener"></a></h3><p></p></article>'
		}

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
		rssUrls = rssUrls.filter(function (item) { return item.length > 0; });
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





