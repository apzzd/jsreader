# jsreader

This is an RSS feedvreader written in javascript, using local storage to store your RSS URLs. Style with your own CSS.

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