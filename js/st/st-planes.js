/* st-planes.js */

st.planes = {
	planes: [],
	init: function() {
		st.planes.createPlanes("soviet", "mig-29", 10);
	},
	createPlanes: function(team, type, qty) {
		for (var i=0;i<qty;i++) {
			var x = (Math.random() * st.p5.real.height) - 0.5 * st.p5.real.height;
			var y = (Math.random() * st.p5.real.width) - 0.5 * st.p5.real.width;
			var a = (Math.random() * 360);
			var plane = st.planes.createPlane(team, type, x, y, a);
			st.planes.planes.push(plane);
		}
	},
	createPlane: function(team, type, x, y, a) {
		var plane = {
			team: team,
			type: type,			
			x: x, 
			y: y,
			a: a,
			v: 20
		};
		return plane;
	}
};