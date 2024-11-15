/* st-planes.js */

st.planes = {
	data: {
		"me-109": {
			v: 154, // m/s
			hp: 100,
			d: 10
		},
		"po-2": {
			v: 30, // m/s
			hp: 20,
			d: 5
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
		for (var i = 0; i < qty; i++) {
			if (team == 'german') {
				var x = st.math.randomBetween(-full, (-1 + spread) * full);
				var y = st.math.randomBetween(-spread * full, spread * full);
				var a = st.math.randomBetween(0, 180);
				var homeAngle = 280;
			}
			if (team == 'soviet') {
				var x = st.math.randomBetween(spread * full, full);
				var y = st.math.randomBetween(-spread * full, spread * full);
				var a = st.math.randomBetween(180, 360);
				var homeAngle = 80;
			}
			var v = st.planes.data[type].v;
			var hp = st.planes.data[type].hp;
			var d = st.planes.data[type].d;
			var plane = st.planes.createPlane(team, type, x, y, a, homeAngle, v, hp, d);
			st.planes.planes.push(plane);
		}
	},

	createPlane: function(team, type, x, y, a, homeAngle, v, hp, d) {
		var plane = {
			team: team,
			type: type,
			x: x,
			y: y,
			a: a,
			homeAngle: homeAngle,
			v: v,
			minTargetDist: 1000,
			target: -1,
			targetDist: 1e10,
			smokes: [],
			removed: false,
			hp: hp,
			d: d
		};
		return plane;
	},

	/**
	 * Update the target for all planes
	 * All planes work independently
	 **/
	updateTargets: function() {
		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			var target = plane.target;
			if (target > -1) {
				if (planes[target].hp <= 0) {
					target = -1;	
				}
			}

			if (target == -1) {
				st.planes.updateTarget(i);
			}
		}
	},

	/**
	 * Update the target for plane index
	 **/
	updateTarget: function(index) {
		var planes = st.planes.planes;
		var indexPlane = planes[index];
		var distArr = st.planes.getTargetDistances(index);
		var minDistIndex = st.planes.minArrDistance(distArr);
		indexPlane.target = minDistIndex;
	},

	minArrDistance: function(distArr) {
		var minIndex = -1;
		var minDist = 1e9;
		for (var i = 0; i < distArr.length; i++) {
			var dist = distArr[i];
			if (dist < minDist) {
				minIndex = i;
				minDist = dist;
			}
		}
		return minIndex;
	},

	getTargetDistances: function(index) {
		var planes = st.planes.planes;
		var d = [];
		for (var i = 0; i < planes.length; i++) {
			var targetPlane = planes[i];
			if ((i == index) || st.planes.sameTeam(index, i) || targetPlane.hp <= 0) {
				d[i] = 1e20;
			} else {
				d[i] = st.planes.calcIndexDistance(index, i);
			}
		}
		return d;
	},

	sameTeam: function(i1, i2) {
		var planes = st.planes.planes;
		var p1 = planes[i1];
		var p2 = planes[i2];
		var b = (p1.team == p2.team);
		return b;
	},

	calcIndexDistance: function(i1, i2) {
		var planes = st.planes.planes;
		var p1 = planes[i1];
		var p2 = planes[i2];
		var d = st.planes.calcPlaneDistance(p1, p2);
		return d;
	},

	calcPlaneDistance: function(p1, p2) {
		var dx = (p2.x - p1.x);
		var dy = (p2.y - p1.y);
		var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		return d;
	},
	
	calcIndexAngle: function(i1, i2) {
		var planes = st.planes.planes;
		var p1 = planes[i1];
		var p2 = planes[i2];
		var d = st.planes.calcPlaneAngle(p1, p2);
		return d;
	},

	/** 
	 * Returns the geo angle difference to the other point
	 */
	calcPlaneAngle: function(p1, p2) {
		var dx = (p2.x - p1.x);
		var dy = (p2.y - p1.y);
		
		// special radians with extra cases
		var theta = Math.atan2(dy, dx);
		
		// convert to degrees
		theta *= 180.0 / Math.PI;
		
		// convert to geographic
		theta = 90.0 - theta;
		
		while (theta > 360.0) {
			theta -= 360.0;
		}
		while (theta < 0.0) {
			theta += 360.0;
		}

		return theta;
	}
	
};