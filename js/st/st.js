/* st.js */

var st = {
	log: function(s) {
		if (typeof(window.console) != "undefined") {
			console.log(s);
		}
	},

	init: function() {
		st.math.init();
		st.render.init();
		st.render.render();
	}
};

$(document).ready(st.init);
