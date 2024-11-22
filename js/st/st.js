/* st.js */

/*
Example urls:
* http://localhost:8080/as-sim/?simulation=angle&angle=0
* http://localhost:8080/as-sim/?simulation=angle&angle=22.5
* http://localhost:8080/as-sim/?simulation=angle&angle=45
* http://localhost:8080/as-sim/?simulation=angle&angle=90
*/

var st = {
	log: function(s) {
		if (typeof(window.console) != "undefined") {
			console.log(s);
		}
	},

	init: function() {
		st.initActions();
		st.math.init();
		st.render.init();
		st.clouds.init();
		st.render.render();
	},
	
	initActions: function() {
		$(".st-reload").on("click", function() {
			window.location.reload();
		});
		$(".st-act-i").on("click", function() {
			window.location.replace("?simulation=acti");
		});
		$(".st-act-ii").on("click", function() {
			window.location.replace("?simulation=actii");
		});
	}
};

$(document).ready(st.init);
