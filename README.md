# jsreader

This is an RSS feed reader written in javascript, using local storage to store your RSS URLs. Host it on your machine: it's all client-side, and fetches won't require CORS access. Style with your own CSS.

## Usage
```
		<link rel="stylesheet" href="css/styles.css">

		<script type="text/javascript" src='js/jsreader.js'></script>
		<script type="text/javascript">
			var feeds = new JSReader({
			    containerSelector: '#articles'
			});
		</script>

```

References:

- https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/
- https://scotch.io/tutorials/building-your-own-javascript-modal-plugin