/* st-render.js */

st.render = {
	init: function() {
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