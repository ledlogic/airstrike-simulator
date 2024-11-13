/* st-planes.js */

st.planes = {
	data: {
		"me-109": {
			v: 154 // m/s
		},
		"po-2" : {
			v: 30 // m/s
		}
	},
	planes: [],
	init: function() {
		st.planes.createPlanes("german", "me-109", 3);
		st.planes.createPlanes("soviet", "po-2", 12);
	},
	createPlanes: function(team, type, qty) {
		var full = st.p5.real.full;
		var spread = 0.5;
		for (var i=0;i<qty;i++) {
			if (team == 'german') {
				var x = st.math.randomBetween(-full, (-1 + spread) * full);
				var y = st.math.randomBetween(-spread * full, spread * full);
				var a = st.math.randomBetween(0, 180);

			}
			if (team == 'soviet') {
				var x = st.math.randomBetween(spread * full, full);
				var y = st.math.randomBetween(-spread * full, spread * full);
				var a = st.math.randomBetween(180, 360);
			}
			var v = st.planes.data[type].v;			
			var plane = st.planes.createPlane(team, type, x, y, a, v);
			st.planes.planes.push(plane);
		}
	},
	createPlane: function(team, type, x, y, a, v) {
		var plane = {
			team: team,
			type: type,			
			x: x, 
			y: y,
			a: a,
			v: v
		};
		return plane;
	}
};