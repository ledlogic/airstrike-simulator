/* st-plane.js */

st.plane = {
	planes: [],
	init: function() {
		st.plane.createPlanes("soviet", "mig-29", 10);
	},
	createPlanes: function(team, type, qty) {
		for (var i=0;i<qty;i++) {
			var plane = createPlane(team, type);
		}
	},
	render: function() {
		st.log("render");

		var r = st.render;
		r.renderReset();

		$(".st-page").removeClass("st-initial-state");
	},
	renderReset: function() {
		$(".st-page-ft").html("");
	}
};