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
		st.log("st.init");
		
		st.initActions();
		st.initBackground();
		st.initSimulation();

		st.math.init();
		st.grid.init();
		st.render.init();
		st.cities.init();
		st.clouds.init();
		st.smokes.init();
		st.time.init();

		st.render.render();
	},
	
	initBackground: function() {
		st.log("st.initBackground");
		
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
		st.log("st.initActions");
		
		$("body").css("-webkit-user-select", "none");
		$("body").css("-moz-user-select", "none");
		$("body").css("-ms-user-select", "none");
		$("body").css("user-select", "none");
		
		$("#st-cb-clouds").on("click", function() { st.clouds.visible = !st.clouds.visible; } );
		$("#st-cb-details").on("click", function() { st.planes.detailVisible = !st.planes.detailVisible; } );
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
	},
	
	initSimulation: function() {
		st.log("st.initSimulation");

		var url = $.url();
		var simulation = url.param('simulation');
		switch (simulation) {
			case "angle":
				var angle = parseFloat(url.param('angle'),0);
				angle = 90 - angle;
				var r = 5000;
				var x1 = Math.cos(angle / 180 * Math.PI) * r;
				var y1 = Math.sin(angle / 180 * Math.PI) * r;
				var x2 = Math.cos((angle + 180) / 180 * Math.PI) * r;
				var y2 = Math.sin((angle + 180) / 180 * Math.PI) * r;
				st.planes.createPlanes("soviet", "po-2", 1, {x: x1, y: y1});
				st.planes.createPlanes("german", "bf-109", 1, {x: x2, y: y2});
				return;
			case "acti":
				st.planes.createPlanes("soviet", "po-2", 12);
				st.planes.createPlanes("german", "bf-109", 3);
				$(".st-act-i").addClass("st-active");
				return;
			case "actii":
				st.planes.createPlanes("soviet", "po-2", 12);
				st.planes.createPlanes("german", "bf-109", 6);
				st.planes.createPlanes("german", "he-177", 2);
				$(".st-act-ii").addClass("st-active");
				return;
			case "actiii":
				st.planes.createPlanes("soviet", "po-2", 6);
				st.planes.createPlanes("soviet", "mig-25", 6);
				st.planes.createPlanes("soviet", "r-40", 24);
				st.planes.createPlanes("german", "me-262", 6);
				st.planes.createPlanes("german", "he-177", 2);
				$(".st-act-iii").addClass("st-active");
				return;
			default:
				st.planes.createPlanes("soviet", "po-2", 12);
				st.planes.createPlanes("german", "bf-109", 3);
				$(".st-act-i").addClass("st-active");
				return;
		}
	}
};

$(document).ready(st.init);
