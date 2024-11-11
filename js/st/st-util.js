/* st-utils.js */

_.mixin({
	capitalize2: function(string) {
		var words = string.split(" ");
		var capWords = [];
		for (var i = 0; i < words.length; i++) {
			capWords[i] = _.capitalizeWord(words[i]);
		}
		ret = capWords.join(" ");
		return ret;
	},
	capitalizeWord: function(string) {
		return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	},
	keyToLabel: function(key) {
		var str = key.replace(/-/g, ' ');
		var dispKey = _.capitalize2(str);
		return dispKey;
	},
	mapToString: function(map) {
		var ret = [];
		_.each(map, function(value, index, list) {
			ret.push("(" + index + ":" + value + ")");
		});
		
		return ret.join(",");
	}
});