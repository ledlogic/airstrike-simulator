/* st.js */

/*
Example urls:
* http://localhost:8080/as-sim/?simulation=angle&angle=0
* http://localhost:8080/as-sim/?simulation=angle&angle=22.5
* http://localhost:8080/as-sim/?simulation=angle&angle=45
* http://localhost:8080/as-sim/?simulation=angle&angle=90
* http://localhost:8080/as-sim/?simulation=acti
* http://localhost:8080/as-sim/?simulation=actii
*/

var st = {
	log: function(s) {
		if (typeof(window.console) != "undefined") {
			console.log(s);
		}
	},

	init: function() {
		st.initActions();
		st.initBackground();

		st.math.init();
		st.grid.init();
		st.render.init();
		st.clouds.init();
		st.smokes.init();
		st.time.init();

		st.render.render();
	},
	
	initBackground: function() {
		var urls = [
			"img/minsk.jpg",
			"img/novgorod.jpg",
			"img/odesa.jpg",
			"img/pripyat-river.jpg"
		]
		var url = urls[st.math.dieArray(urls)];
		$(".st-page-img").attr("src", url);
	},
	
	initActions: function() {
		$("body").css("-webkit-user-select", "none");
		$("body").css("-moz-user-select", "none");
		$("body").css("-ms-user-select", "none");
		$("body").css("user-select", "none");
		
		$("#st-cb-clouds").on("click", function() { st.clouds.visible = !st.clouds.visible; } );
		$("#st-cb-grid").on("click", function() { st.grid.visible = !st.grid.visible; } );

		$(".st-act-i").on("click", function() {
			window.location.replace("?simulation=acti");
		});
		$(".st-act-ii").on("click", function() {
			window.location.replace("?simulation=actii");
		});
		$(".st-act-iii").on("click", function() {
			window.location.replace("?simulation=actiii");
		});

		$(".st-reload").on("click", function() {
			window.location.reload();
		});
	}
};

$(document).ready(st.init);
